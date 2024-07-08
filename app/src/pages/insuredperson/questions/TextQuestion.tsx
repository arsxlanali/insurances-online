import { TextField, Grid } from '@mui/material';
import TooltipReusable from 'src/components/TooltipReusable';
import { useField } from 'formik';
import QuestionLayout from './QuestionLayout';

interface Props {
  question: Question;
}

export default function TextQuestion({ question }: Props) {
  const [{ value, ...field }, meta] = useField(
    question.key.replace(/\./g, '&').replace(/\[\]/g, '$')
  );

  return (
    <QuestionLayout question={question} meta={meta}>
      <Grid item minWidth={'100%'}>
        <TextField
          error={meta.touched && Boolean(meta.error)}
          value={value ?? question?.answer?.value}
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
