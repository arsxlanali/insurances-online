import { useEffect } from 'react';
import { TextField, Grid } from '@mui/material';
import TooltipReusable from 'src/components/TooltipReusable';
import { useField } from 'formik';
import QuestionLayout from './QuestionLayout';
import BANK from 'src/config/bank';

interface Props {
  question: Question;
}

export default function OrderQuestion({ question }: Props) {
  const [field, meta] = useField(
    question.key.replace(/\./g, '&').replace(/\[\]/g, '$')
  );
  const [, , helpersBank] = useField('orderBankName');
  useEffect(() => {
    if (field.value) {
      const name = BANK[field.value.substring(4, 12)];
      helpersBank.setValue(name);
    }
    // eslint-disable-next-line
  }, [field.value]);
  return (
    <QuestionLayout question={question} meta={meta}>
      <Grid item minWidth={'100%'}>
        <TextField
          error={meta.touched && Boolean(meta.error)}
          {...field}
          hiddenLabel
          fullWidth
          disabled={question.readonly}
          variant="filled"
        />
      </Grid>
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
