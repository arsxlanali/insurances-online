import { TextField, Grid } from '@mui/material';
import { FieldInputProps, useField } from 'formik';
import QuestionLayout from './QuestionLayout';
import { useAppDispatch } from 'src/utils/hooks';
import { useEffect } from 'react';
import TooltipReusable from 'src/components/TooltipReusable';
import { updateChildVisibility } from 'src/store/reducers/riskCheck.reducer';

interface Props {
  question: Question;
  riskIdx: number;
  personIdx: number;
}

export default function NumberQuestion({
  question,
  riskIdx,
  personIdx,
}: Props) {
  const dispatch = useAppDispatch();
  const [field, meta] = useField(
    question.key.replace(/\./g, '&').replace(/\[\]/g, '$')
  );
  useEffect(() => {
    const { value } = field;
    if (value !== undefined || value !== null || value !== '') {
      const regex = new RegExp(question.expChild);
      const isMatch = regex.test(field.value);

      const visible = question.expChildCheckPositive === isMatch;
      const key = question.key;
      dispatch(
        updateChildVisibility({
          value,
          visible,
          key,
          riskIdx,
          personIdx: personIdx - 1,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);

  const handleInputChange =
    (field: FieldInputProps<number>) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      if (value === '' || /^(0|[1-9]\d*)$/.test(value)) {
        field.onChange(event);
      }
    };

  return (
    <QuestionLayout question={question} meta={meta}>
      <TextField
        error={meta.touched && Boolean(meta.error)}
        {...field}
        value={field.value ?? question.answer.value}
        type={'number'}
        InputProps={{
          inputProps: {
            min: question.minValue >= 0 ? question.minValue : 1,
            max: question.maxValue,
          },
        }}
        onChange={handleInputChange(field)}
        hiddenLabel
        fullWidth
        disabled={question.readonly}
        variant="filled"
        onWheel={(event) =>
          event.target instanceof HTMLElement && event.target.blur()
        }
      />
      <Grid item paddingLeft={'20px'}>
        {question.answer.prefilled && !question.readonly && (
          <TooltipReusable
            title={[
              'Diese Angabe wurde aus Ihren vorherigen Angaben übernommen. Bitte überprüfen Sie diese auf Korrektheit.',
            ]}
            iconFlag={false}
          />
        )}
      </Grid>
    </QuestionLayout>
  );
}
