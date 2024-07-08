import { useEffect } from 'react';
import { FormControl, MenuItem, Select, Grid } from '@mui/material';
import { useField } from 'formik';
import QuestionLayout from './QuestionLayout';
import TooltipReusable from 'src/components/TooltipReusable';
import { useAppDispatch } from 'src/utils/hooks';
import { updateChildVisibility } from 'src/store/reducers/riskCheck.reducer';

interface Props {
  question: Question;
  riskIdx: number;
  personIdx: number;
}

export default function ComboboxQuestion({
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
    const key = question.key;
    if (question.childQuestionary) {
      let isMatch = false;
      for (const child of question.childQuestionary) {
        const regex1 = new RegExp(child.expChild);
        const regex2 = new RegExp(question.expChild);
        if (regex1.test(value) || regex2.test(value)) {
          isMatch = true;
          break;
        }
      }
      if (value !== undefined && value !== null && value !== '') {
        dispatch(
          updateChildVisibility({
            visible: isMatch,
            value,
            key,
            riskIdx,
            personIdx: personIdx - 1,
          })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);
  return (
    <QuestionLayout question={question} meta={meta}>
      <FormControl hiddenLabel fullWidth>
        <Select
          {...field}
          value={field.value ?? question.answer.value}
          error={meta.touched && Boolean(meta.error)}
          variant="filled"
          disabled={question.readonly}
        >
          {question.answer.picks?.length &&
            question.answer.picks.map((p, index) => (
              <MenuItem key={`${p.id}${index}`} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
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
