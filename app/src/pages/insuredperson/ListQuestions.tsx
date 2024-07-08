import { useAppSelector } from 'src/utils/hooks';
import CheckboxQuestion from './questions/CheckboxQuestion';
import ComboboxQuestion from './questions/ComboboxQuestion';
import DateQuestion from './questions/DateQuestion';
import LabelQuestion from './questions/LabelQuestion';
import NumberQuestion from './questions/NumberQuestion';
import OccupationQuestion from './questions/OccupationQuestion';
import RadioQuestion from './questions/RadioQuestion';
import TextQuestion from './questions/TextQuestion';
import DownloadButton from './questions/DownloadButton';
import OrderQuestion from './questions/OrderQuestion';
import {
  getDocumentById,
  extractDocumentId,
  downloadDocument,
} from 'src/utils';
import { Button, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';

interface Props {
  questions: Question[];
  personId: string;
  riskIdx: number;
  personIdx: number;
  formRef: any;
  readonly: boolean;
  validateForm: any;
}
export default function ListQuestions({
  questions,
  personId,
  riskIdx,
  personIdx,
  formRef,
  readonly,
  validateForm,
}: Props) {
  const { errors, touched, setFieldValue } = useFormikContext();
  const [downloadAllDisable, setDownloadAllDisable] = useState(false);

  useEffect(() => {
    if (formRef.current) {
      for (const fieldName in errors) {
        if (
          touched[fieldName as keyof typeof touched] &&
          errors[fieldName as keyof typeof errors]
        ) {
          const fieldElement = formRef.current.querySelector(
            `[name="${fieldName}"]`
          );
          if (fieldElement) {
            fieldElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
            break;
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors, touched]);

  const documents: DownloadDoc[] = useAppSelector(
    (state) => state.riskCheck.documents
  );

  function renderQuestion(
    q: Question,
    index: number
  ): JSX.Element | null | undefined {
    const key = `${q.key}${index}`;
    if ((q.computed && q.expComputation !== null) || q.predefine || !q.visible)
      return null;

    if (q.answer.type === 'Text') {
      if (q.key === 'orderIban') {
        return <OrderQuestion key={key} question={q} />;
      }
      return <TextQuestion key={key} question={q} />;
    } else if (q.answer.type === 'Radio') {
      const documentId = extractDocumentId(q.key);
      const document = getDocumentById(documentId, documents);
      if (
        q.key.match(/downloadLnDocument_(.+)/) ||
        q.key.match(/lnTaaDownloadDocuments_(.+)/)
      ) {
        return (
          <DownloadButton
            question={q}
            downloadDocument={() => {
              document &&
                downloadDocument(
                  document?.content,
                  `${document.displayName}.${document.fileType}`
                );
            }}
          />
        );
      }

      return q.answer.picks?.length === 1 ? (
        <CheckboxQuestion
          key={key}
          question={q}
          riskIdx={riskIdx}
          personIdx={personIdx}
        />
      ) : (
        <RadioQuestion
          key={key}
          question={q}
          riskIdx={riskIdx}
          personIdx={personIdx}
        />
      );
    } else if (q.answer.type === 'Combobox') {
      return q.answer.picks?.length === 0 ? (
        <OccupationQuestion key={key} question={q} person={personId} />
      ) : (
        <ComboboxQuestion
          key={key}
          question={q}
          riskIdx={riskIdx}
          personIdx={personIdx}
        />
      );
    } else if (
      q.answer.type === 'Number' ||
      q.answer.type === 'NumberInteger' ||
      q.answer.type === 'Currency'
    ) {
      return (
        <NumberQuestion
          key={key}
          question={q}
          riskIdx={riskIdx}
          personIdx={personIdx}
        />
      );
    } else if (q.answer.type === 'Date') {
      return <DateQuestion key={key} question={q} />;
    } else {
      return <LabelQuestion key={key} question={q} />;
    }
  }

  function renderChildQuestions(q: Question): JSX.Element | null {
    if (q?.childQuestionary) {
      return q.childQuestionary.map((child: any) => {
        return (
          <ListQuestions
            readonly
            questions={child?.questions}
            personId={personId}
            riskIdx={riskIdx}
            personIdx={personIdx}
            formRef={formRef}
            validateForm
          />
        );
      });
    }
    return null;
  }

  const documentIds = questions
    .filter((q) => q.key.match(/downloadLnDocument_(.+)/))
    .map((q) => q.key);

  const handleDownloadAll = () => {
    documentIds.forEach((id) => {
      const documentId = extractDocumentId(id);
      const document = getDocumentById(documentId, documents);
      downloadDocument(
        document?.content,
        `${document?.displayName}.${document?.fileType}`
      );
      setDownloadAllDisable(true);
      setFieldValue(id, 'true');
    });
    setTimeout(() => {
      validateForm();
    }, 500);
  };

  return (
    <>
      {questions.map((q, index) => {
        const key = `${q.key}${index}`;
        return (
          <React.Fragment key={key}>
            {renderQuestion(q, index)}
            {renderChildQuestions(q)}
          </React.Fragment>
        );
      })}
      {documentIds.length > 1 && !readonly && (
        <>
          <Divider />
          <Button
            variant="contained"
            sx={{ marginY: 2 }}
            color="primary"
            disabled={downloadAllDisable}
            onClick={handleDownloadAll}
          >
            ALLE DOKUMENTE HERUNTERLADEN
          </Button>
        </>
      )}
    </>
  );
}
