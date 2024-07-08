import { Autocomplete, TextField, Grid } from '@mui/material';
import { useField } from 'formik';
import QuestionLayout from './QuestionLayout';
import { debounce } from '@mui/material/utils';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/utils/hooks';
import { insuranceOccupation } from 'src/store/thunks/occupation.thunk';
import TooltipReusable from 'src/components/TooltipReusable';

interface Props {
  question: Question;
  person: string;
}

export default function OccupationQuestion({ question, person }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [field, meta, helper] = useField(
    question.key.replace(/\./g, '&').replace(/\[\]/g, '$')
  );
  const { occupations } = useAppSelector(({ riskCheck }) => riskCheck);
  const dispatch = useAppDispatch();

  const fetch = useMemo(
    () =>
      debounce((input: string) => {
        dispatch(insuranceOccupation({ input, Id: person }));
      }, 400),
    [dispatch, person]
  );

  useEffect(() => {
    if (inputValue) {
      fetch(inputValue);
    }
  }, [inputValue, fetch]);

  return (
    <QuestionLayout question={question} meta={meta}>
      <Autocomplete
        fullWidth
        options={occupations}
        {...field}
        value={field.value ?? question.answer.value}
        onChange={(_, val) => {
          helper.setValue(val);
        }}
        onInputChange={(_, val) => {
          setInputValue(val);
        }}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        disabled={question.readonly}
        renderInput={(params) => (
          <TextField
            {...params}
            error={meta.touched && Boolean(meta.error)}
            disabled={question.readonly}
            hiddenLabel
            placeholder="suchen"
            variant="filled"
          />
        )}
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
