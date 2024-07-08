import { Grid, Button, FormControl, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { checkRiskCheckAdditional } from 'src/store/thunks/riskCheck.thunk';
import {
  addQuestionaire,
  removeQuestionaireStep,
  reverseVisibility,
  setLabelQuestionaire,
  setOpenNoticeTrue,
} from 'src/store/reducers/riskCheck.reducer';
import { getComputedValues, getInputs } from 'src/utils';
import { useAppDispatch, useAppSelector } from 'src/utils/hooks';
import ListQuestions from './ListQuestions';
import { useRef, useMemo } from 'react';
import { decrementStep } from 'src/store/reducers/stepper.reducers';
import { updateAnsweredCustomQuestions } from 'src/store/reducers/config.reducer';

interface Props {
  questionaire: Questionnaire;
  submitText: string;
  personId: string;
  riskIdx: number;
  personIdx: number;
  readonly: boolean;
}

export default function DynamicForm({
  questionaire,
  submitText,
  personId,
  personIdx,
  riskIdx,
  readonly,
}: Props) {
  const dispatch = useAppDispatch();
  const formRef = useRef<HTMLFormElement>(null);
  const { questionnaireStep, questionnaireStepTotal } = useAppSelector(
    (state) =>
      state.riskCheck.selectedInsurences[personIdx - 1].riskCheckOptions[
        riskIdx
      ]
  );
  const { steps } = useAppSelector((state) => state.stepper);

  const { initialValues, questions, validationSchema } = useMemo(() => {
    return getInputs(
      questionaire,
      questionnaireStep,
      questionnaireStepTotal,
      readonly
    );
  }, [questionaire, questionnaireStep, questionnaireStepTotal, readonly]);

  return (
    <Formik
      key={questionnaireStep}
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize={false}
      validateOnMount={true}
      validateOnBlur={true}
      validateOnChange={true}
      onSubmit={(values) => {
        const newValues: { [key: string]: any } = {};

        for (const key in values) {
          if (values.hasOwnProperty(key)) {
            let newKey: string = key.replace(/\$/g, '[]').replace(/&/g, '.');
            newValues[newKey] = values[key];
          }
        }

        const computed = getComputedValues(questions, newValues);

        if (!readonly) {
          dispatch(
            setLabelQuestionaire({
              personIdx: personIdx - 1,
              riskIdx: riskIdx,
              questionnaireStep,
            })
          );

          dispatch(
            addQuestionaire({
              personIdx: personIdx - 1,
              values: { ...newValues, ...computed },
            })
          );

          dispatch(
            checkRiskCheckAdditional({
              Id: personId,
              personIdx: personIdx - 1,
              riskIdx,
              values: { ...newValues, ...computed },
            } as RiskCheckThunkProps)
          );
        }
      }}
    >
      {({ isValid, validateForm }) => {
        return (
          <Form ref={formRef}>
            <ListQuestions
              questions={questions}
              personId={personId}
              riskIdx={riskIdx}
              personIdx={personIdx}
              formRef={formRef}
              readonly={readonly}
              validateForm={validateForm}
            />
            <Grid
              display={'flex'}
              flexDirection={'row-reverse'}
              justifyContent={'space-between'}
              pb={2}
            >
              {questions.length > 0 ? (
                <FormControl sx={{ width: '200px' }}>
                  {!readonly && (
                    <Button
                      variant="contained"
                      size="large"
                      type="submit"
                      onClick={() => {
                        validateForm();
                      }}
                      disabled={!isValid}
                    >
                      {submitText}
                    </Button>
                  )}
                </FormControl>
              ) : (
                <Typography variant="h6">Alle Fragen beantwortet</Typography>
              )}
              <FormControl>
                {questionnaireStep > 0 && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (steps === 1 && questionnaireStep === 1) {
                        dispatch(
                          setOpenNoticeTrue({ personIdx: personIdx - 1 })
                        );
                        dispatch(decrementStep());
                      } else if (steps === 2) {
                        dispatch(
                          reverseVisibility({
                            personIdx: personIdx - 1,
                            riskIdx,
                          })
                        );
                        dispatch(
                          removeQuestionaireStep({
                            personIdx: personIdx - 1,
                            riskIdx,
                          })
                        );
                        dispatch(decrementStep());
                      } else {
                        dispatch(updateAnsweredCustomQuestions(false));
                        dispatch(
                          removeQuestionaireStep({
                            personIdx: personIdx - 1,
                            riskIdx,
                          })
                        );
                      }
                    }}
                  >
                    Zurück
                  </Button>
                )}
              </FormControl>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
}
