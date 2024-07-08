import { Box } from '@mui/material';
import QuestionLayout from './QuestionLayout';

interface Props {
  question: Question;
}

export default function LabelQuestion({ question }: Props) {
  return (
    <QuestionLayout question={question}>
      <Box />
    </QuestionLayout>
  );
}
