import {
  FormControlLabel,
  Checkbox,
  FormControl,
  FormGroup,
} from '@mui/material';
import { useField } from 'formik';
import QuestionLayout from './QuestionLayout';
import { updateChildVisibility } from 'src/store/reducers/riskCheck.reducer';
import { useEffect } from 'react';
import { useAppDispatch } from 'src/utils/hooks';
interface Props {
  question: Question;
  riskIdx: number;
  personIdx: number;
}

export default function CheckboxQuestion({
  question,
  riskIdx,
  personIdx,
}: Props) {
  const dispatch = useAppDispatch();
  const [field, meta, helpers] = useField(
    question.key.replace(/\./g, '&').replace(/\[\]/g, '$')
  );
  useEffect(() => {
    const { value } = field;
    if (value !== undefined && value !== null && value !== '') {
      const regex = new RegExp(question.expChild);
      const isMatch = regex.test(field.value);
      const visible = question.expChildCheckPositive === isMatch;
      const key = question.key;
      dispatch(
        updateChildVisibility({
          visible,
          key,
          riskIdx,
          personIdx: personIdx - 1,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);

  return (
    <QuestionLayout question={question} meta={meta}>
      <FormControl error={meta.touched && Boolean(meta.error)}>
        <FormGroup>
          {question.answer.picks?.length &&
            question.answer.picks.map((p, index) => (
              <FormControlLabel
                key={`${p.id}${index}`}
                {...field}
                value={p.id}
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: 24,
                  },
                }}
                control={
                  <Checkbox
                    disabled={question.readonly}
                    checked={
                      (field.value && p.id === field.value) ||
                      (!field.value && p.id === question.answer.value)
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        helpers.setValue(e.target.value);
                      } else {
                        helpers.setValue('');
                      }
                    }}
                  />
                }
                label={p.name}
              />
            ))}
        </FormGroup>
      </FormControl>
    </QuestionLayout>
  );
}
