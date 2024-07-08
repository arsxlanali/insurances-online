import {
  Box,
  Grid,
  Typography,
  Divider,
  FormHelperText,
  Link,
} from '@mui/material';
import { FieldMetaProps } from 'formik';
import additionalInfo from '../../../config/aditionalInformation.json';
import TooltipReusable from 'src/components/TooltipReusable';

interface Props {
  question: Question;
  children: JSX.Element | JSX.Element[];
  meta?: FieldMetaProps<any>;
  percentage?: number;
}

export default function QuestionLayout({
  question: q,
  children,
  meta,
  percentage,
}: Props) {
  const [info] = additionalInfo.filter(
    (question) => question.questionId === q.key
  );
  return (
    <Box>
      <Divider />
      <Grid container spacing={2} paddingY={1.5} alignItems="center">
        <Grid item xs={12}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <Typography
                fontWeight={q.html ? 'normal' : 'bold'}
                {...(q.html
                  ? {
                      dangerouslySetInnerHTML: {
                        __html: q.text,
                      },
                    }
                  : {
                      children: (
                        <>
                          <span>{q.text}</span>
                          {info?.informationText && (
                            <TooltipReusable title={[info?.informationText]} />
                          )}
                        </>
                      ),
                    })}
              ></Typography>
            </Grid>
          </Grid>

          {q.helpText &&
            (q.helpText.includes('http') ? (
              <Link href={q.helpText} color="inherit" target="_blank">
                {q.helpText}
              </Link>
            ) : (
              <Typography pt={1.5}>{q.helpText}</Typography>
            ))}
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          width={'100%'}
          display={'flex'}
          alignItems={'center'}
        >
          {children}
        </Grid>
      </Grid>
      {meta ? (
        <FormHelperText sx={{ fontSize: 12 }} error>
          {meta.touched ? meta.error : ''}
        </FormHelperText>
      ) : null}
    </Box>
  );
}
