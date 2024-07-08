import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useField } from 'formik';
import QuestionLayout from './QuestionLayout';
import { useEffect } from 'react';
import { useAppDispatch } from 'src/utils/hooks';
import { updateChildVisibility } from 'src/store/reducers/riskCheck.reducer';

interface Props {
  question: Question;
  riskIdx: number;
  personIdx: number;
}

export default function RadioQuestion({ question, riskIdx, personIdx }: Props) {
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
  return (
    <QuestionLayout question={question} meta={meta}>
      <Box>
        {question.answer.picks?.length && (
          <FormControl error={meta.touched && Boolean(meta.error)}>
            <RadioGroup row>
              {question.answer.picks.map((p, index) => (
                <FormControlLabel
                  key={`${p.id}${index}`}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      fontSize: 24,
                    },
                  }}
                  {...field}
                  checked={
                    (field.value && p.id === field.value) ||
                    (!field.value && p.id === question.answer.value)
                  }
                  value={p.id}
                  control={
                    <Radio
                      disabled={question.readonly}
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
            </RadioGroup>
          </FormControl>
        )}
      </Box>
    </QuestionLayout>
  );
}
