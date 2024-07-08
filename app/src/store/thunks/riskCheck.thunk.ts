import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import * as OrderAPI from 'src/api/OrderAPI';
import AppConsts from 'src/config/appconst';
import { RootState } from '..';
import {
  addDocuments,
  addQuestionaireStep,
  saveQuestionsValues,
  setOrderTrue,
} from '../reducers/riskCheck.reducer';
import { incrementStep } from '../reducers/stepper.reducers';
import { changePersonState } from '../reducers/contribution.reducer';
import { getTarrifDocuments } from './document.thunk';
import predefine from '../../config/predefine.json';
import { deepCopy, getFilteredPredefine } from 'src/utils';
import { getRiskCehckDocuments } from 'src/api/DocumentAPI';
import { updateAnsweredCustomQuestions } from '../reducers/config.reducer';
// import ReactGA from "react-ga4";

export const startRiskCheckAdditional = createAsyncThunk<
  Questionnaire,
  RiskCheckThunkProps,
  { state: RootState }
>('order/startriskcheck/additional', async (props, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const res = await OrderAPI.startRiskCheck(
      state.config.mandant,
      getCheckRiskCheckBody(state, props)
    );
    const previousQuestionaire =
      state.riskCheck.selectedInsurences[props.personIdx].previousQuestionaire;

    const mandnat: string = state.config.mandant;
    const insuranceId =
      state.riskCheck.selectedInsurences[props.personIdx].riskCheckOptions[
        props.riskIdx
      ].option.insuranceId;
    const predefineQuestion = getFilteredPredefine(
      predefine,
      mandnat,
      insuranceId
    );
    const tariffId = getCheckRiskCheckBody(state, props).tariffPk.replaceAll(
      ';',
      '#'
    );
    const { personIdx, riskIdx } = props;
    thunkAPI.dispatch(addQuestionaireStep({ personIdx, riskIdx }));
    const { questionnaireStepTotal } =
      state.riskCheck.selectedInsurences[personIdx].riskCheckOptions[riskIdx];

    const questionaire = getQuestionaire(
      res,
      previousQuestionaire,
      predefineQuestion,
      questionnaireStepTotal
    );
    const shouldFetchDocs = questionaire.questions.find((q) =>
      q.key.match(/downloadLnDocument_(\d+)/)
    );
    if (shouldFetchDocs) {
      thunkAPI.dispatch(
        getTarrifDocuments({
          tariffId,
        })
      );
    }
    return questionaire;
  } catch (e) {
    console.error(e);
    throw e;
  }
});

export const checkRiskCheckAdditional = createAsyncThunk<
  Questionnaire,
  RiskCheckThunkProps,
  { state: RootState }
>('order/checkriskcheck/additional', async (props, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as RootState;
    const customQuestions = state.config.customQuestions;
    const answeredCustomQuestions = state.config.answeredCustomQuestions;

    thunkAPI.dispatch(
      saveQuestionsValues({
        idx: props.riskIdx,
        values: props.values,
        personIdx: props.personIdx,
      })
    );
    let res;
    const { personIdx, riskIdx } = props;
    const { questionnaireStep, questionnaireStepTotal } =
      state.riskCheck.selectedInsurences[personIdx].riskCheckOptions[riskIdx];
    if (questionnaireStep < questionnaireStepTotal) {
      // Start the risk check
      res = await OrderAPI.startRiskCheck(
        state.config.mandant,
        getCheckRiskCheckBody(state, props)
      );

      // If difference is 1, just call startRiskCheck
      if (questionnaireStep !== 1) {
        for (let i = 0; i < questionnaireStep - 1; i++) {
          res = await OrderAPI.checkRiskCheck(
            state.config.mandant,
            getCheckRiskCheckBody(state, props, res.data.value.riskCheckId)
          );
        }
      }
    } else {
      res = await OrderAPI.checkRiskCheck(
        state.config.mandant,
        getCheckRiskCheckBody(state, props)
      );
    }

    const previousQuestionaire =
      state.riskCheck.selectedInsurences[props.personIdx].previousQuestionaire;
    const mandnat: string = state.config.mandant;
    const insuranceId =
      state.riskCheck.selectedInsurences[props.personIdx].riskCheckOptions[
        props.riskIdx
      ].option.insuranceId;
    const predefineQuestion = getFilteredPredefine(
      predefine,
      mandnat,
      insuranceId
    );

    const ques = getQuestionaire(
      res,
      previousQuestionaire,
      predefineQuestion,
      questionnaireStep
    );

    const { selectedInsurences } = state.riskCheck;
    const { personState } = state.contribution;

    if (ques.riskCheckStatus === AppConsts.orderDatacomplete) {
      const docResponse = await getRiskCehckDocuments(
        state.config.mandant,
        ques.riskCheckId
      );
      thunkAPI.dispatch(addDocuments(docResponse.data.value.documents));
    }
    if (
      ques.riskCheckStatus === AppConsts.orderDataIncomplete &&
      customQuestions.length > 0 &&
      !answeredCustomQuestions
    ) {
      thunkAPI.dispatch(updateAnsweredCustomQuestions(true));
      const customQues = deepCopy(
        getQuestionaire(
          {
            ...res,
            data: {
              ...res.data,
              value: {
                ...res.data.value,
                questionary: {
                  ...res.data.value.questionary,
                  questions: customQuestions,
                },
              },
            },
          },
          previousQuestionaire,
          predefineQuestion,
          questionnaireStep
        )
      );
      return customQues;
    }

    if (ques.riskCheckStatus === AppConsts.orderWaitingSubmit) {
      thunkAPI.dispatch(setOrderTrue());
      const selectedInsurence = selectedInsurences[props.personIdx];
      if (
        personState.length > 1 &&
        selectedInsurence.riskCheckOptions.filter(
          (e) =>
            e.questionnaire?.riskCheckStatus !== AppConsts.orderWaitingSubmit
        ).length === 1 &&
        ques.riskCheckStatus === AppConsts.orderWaitingSubmit
      ) {
        thunkAPI.dispatch(changePersonState());
      }
      const riskCheckRemaning = selectedInsurence.riskCheckOptions.filter(
        (i) => !i.questionnaire
      );
      if (riskCheckRemaning.length) {
        const Id = state.contribution.persons[props.personIdx].Id;
        const firstName = state.contribution.persons[props.personIdx].firstName;
        const familyName = state.contribution.persons[props.personIdx].lastName;

        const riskIdx = selectedInsurence.riskCheckOptions.findIndex(
          (insurance) => insurance === riskCheckRemaning[0]
        );
        const personIdx = props.personIdx;
        thunkAPI.dispatch(
          startRiskCheckAdditional({
            Id,
            riskIdx,
            personIdx,
            values: {
              firstName,
              familyName,
            },
          } as RiskCheckThunkProps)
        );
      }

      const keys = Object.keys(selectedInsurences);
      const lastKey = keys[keys.length - 1];

      const isWaitingForSubmit =
        ques.riskCheckStatus === AppConsts.orderWaitingSubmit;
      const lastRiskCheckOption =
        selectedInsurences[lastKey]?.riskCheckOptions[
          selectedInsurences[lastKey]?.riskCheckOptions.length - 1
        ]?.questionnaire;

      const isDataIncomplete =
        lastRiskCheckOption?.riskCheckStatus === AppConsts.orderDataIncomplete;

      const isDataComplete =
        lastRiskCheckOption?.riskCheckStatus === AppConsts.orderDatacomplete;

      const showNext =
        isWaitingForSubmit && (isDataIncomplete || isDataComplete);

      if (questionnaireStep < questionnaireStepTotal) {
        thunkAPI.dispatch(incrementStep());
      } else if (showNext) {
        thunkAPI.dispatch(incrementStep());
      }
    }

    return ques;
  } catch (e) {
    console.error(e);
    throw e;
  }
});

export const getQuestionaire = (
  res: AxiosResponse<any, any>,
  previousQuestionaire: any = {},
  predefineQuestion: any = {},
  questionaireStep: number = 0
) => {
  if (!res.data.success) {
    throw new Error('Ein Fehler ist aufgetreten');
  } else if (res.data.value?.questionary?.questionaryErrors) {
    throw new Error(
      Object.values<string>(
        res.data.value?.questionary?.questionaryErrors
      ).join('/n')
    );
  }

  const extractQuestions: any = (questionsData: any[]) => {
    return questionsData.map((q) => {
      let childQuestionary = [];

      if (q.childQuestionary?.questions) {
        childQuestionary = [
          {
            expChild: null,
            questions: extractQuestions(
              Object.values<any>(q.childQuestionary?.questions)
            ),
          },
        ];
      } else if (q.flatQuestions) {
        childQuestionary = q.flatQuestions.map((flatQ: any) => {
          return {
            expChild: flatQ?.dependencies[0]?.expChild,
            questions: extractQuestions(
              Object.values<any>(flatQ?.questionaryForm?.questions)
            ),
          };
        });
      }

      const childQuestionaryWithVisibleFlagFalse = childQuestionary.map(
        (childQ: any) => ({
          ...childQ,
          questions: childQ?.questions?.map((child: Question) => ({
            ...child,
            visible: false,
          })),
        })
      );

      const questionaireValue =
        predefineQuestion?.[q.id] ??
        questionnaire.questionaryValues.find((kw) => kw.key === q.id)?.value;
      const value =
        q.answer.answerType !== 'Radio'
          ? previousQuestionaire?.[q.id] ?? questionaireValue
          : questionaireValue;

      const prefilled =
        q.answer.answerType !== 'Radio'
          ? previousQuestionaire?.[q.id]
            ? true
            : false
          : false;

      const readonly = q.id === 'orderBankName' ? true : q.readonly;
      return {
        key: q.id,
        questionaireStep: questionaireStep + 1,
        optional: !q.questionMandatory,
        predefine: predefineQuestion?.[q.id] ? true : false,
        readonly: readonly,
        computed: q.computed,
        visible: q.visible,
        expComputation: q.expComputation,
        maxValue: q.maxValue,
        minValue: q.minValue,
        html: q.html,
        text: q.questionText,
        helpText: q.helpText,
        expChildCheckPositive: q.expChildCheckPositive,
        expChild: q.expChild,
        childQuestionary:
          childQuestionaryWithVisibleFlagFalse.length > 0
            ? childQuestionaryWithVisibleFlagFalse
            : null,
        answer: {
          type: q.answer.answerType,
          orientation: q.answer.orientation,
          expValidation: q.answer.expValidation,
          errorMsg: q.answer.errorMessage,
          picks: q.answer.picks
            ? q.answer.picks.map((p: any) => ({ id: p.id, name: p.name }))
            : null,
          value,
          prefilled,
          alreadyAnswered: false,
        },
      };
    });
  };

  const questionnaire: Questionnaire = {
    questions: [],
    questionaryValues: [],
    riskCheckId: res.data.value.riskCheckId,
    riskCheckStatus: res.data.value.riskCheckStatus,
    referenceId: res.data.value.referenceId,
    loading: false,
    documents: [],
  };

  if (!res.data.value.questionary) return questionnaire;

  Object.entries<string>(res.data.value.questionary.questionaryValues).forEach(
    ([key, value]) => {
      questionnaire.questionaryValues.push({ key, value, questionaireStep });
    }
  );

  const questionsData = Object.values<any>(
    res.data.value.questionary.questions
  );
  questionnaire.questions = extractQuestions(questionsData);
  return questionnaire;
};

const getCheckRiskCheckBody = (
  state: RootState,
  props: RiskCheckThunkProps,
  riskCheckId?: string
) => {
  const questionnaire =
    state.riskCheck.selectedInsurences[props.personIdx].riskCheckOptions[
      props.riskIdx
    ].questionnaire;
  if (!riskCheckId) {
    riskCheckId = questionnaire?.riskCheckId;
  }
  const body = getRiskCheckBody(state, props);

  questionnaire?.questionaryValues.forEach((qv) => {
    body.values[qv.key] = qv.value;
  });

  body.values = {
    ...body.values,
    ...props.values,
  };
  if (state.config.customValues) {
    body.values = {
      ...body.values,
      ...state.config.customValues,
    };
  }
  body.riskCheckId = riskCheckId;
  return body;
};

const getRiskCheckBody = (state: RootState, props: any) => {
  const startDate = state.contribution.commencementDate;
  const person = state.contribution.persons.find(({ Id }) => Id === props.Id);
  const tariff =
    state.riskCheck.selectedInsurences[props.personIdx].riskCheckOptions[
      props.riskIdx
    ].option;
  if (!person) throw new Error('No person exists');
  const mandant = state.config.mandant.toUpperCase() + '_B2C';
  const { firstName, lastName, ...agentData } = state.config.agentData;
  return {
    agentData: {
      agentid: mandant,
      ...agentData,
    },
    tariffPk: tariff.tarrifId.replaceAll('#', ';'),
    startdate: startDate,
    gender: person.gender === AppConsts.male ? 1 : 2,
    birthday: person.birthdate,
    occupationGroup: Number(AppConsts.occupationGroup),
    maintariffType: AppConsts.maintariffType,
    customerId: mandant,
    values: {
      tariffFee: tariff.fee.toString(),
    },
  } as RiskCheckBody;
};
