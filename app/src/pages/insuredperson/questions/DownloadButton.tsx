import { FormControl, Button } from '@mui/material';
import { useField } from 'formik';
import QuestionLayout from './QuestionLayout';
interface Props {
  question: Question;
  downloadDocument: () => void;
}

export default function DownloadButton({ question, downloadDocument }: Props) {
  const [field, meta, helpers] = useField(question.key);

  return (
    <QuestionLayout question={question} meta={meta}>
      <FormControl error={meta.touched && Boolean(meta.error)}>
        <Button
          key={question.key}
          variant="contained"
          color="primary"
          disabled={
            field.value === 'true' || question.answer.value === 'true'
              ? true
              : false
          }
          onClick={() => {
            downloadDocument();
            helpers.setValue('true');
          }}
        >
          Dokument herunterladen
        </Button>
      </FormControl>
    </QuestionLayout>
  );
}
