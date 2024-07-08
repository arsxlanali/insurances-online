import { useEffect } from 'react';

import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/de'; // Import the German locale for dayjs
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useField } from 'formik';

import { TextField, FormControl, Grid } from '@mui/material';
import {
  LocalizationProvider,
  DatePicker,
  PickersDayProps,
  PickersDay,
} from '@mui/x-date-pickers';

import QuestionLayout from './QuestionLayout';
import TooltipReusable from 'src/components/TooltipReusable';

dayjs.locale('de');

interface Props {
  question: Question;
}

export default function DateQuestion({ question }: Props) {
  const [field, meta, helper] = useField(
    question.key.replace(/\./g, '&').replace(/\[\]/g, '$')
  );

  useEffect(() => {
    const currentDate = dayjs();
    helper.setValue(currentDate?.format('YYYY-MM-DD'));
  }, []);

  const handleDateChange = (newValue: Dayjs | null) => {
    const data = newValue?.format('YYYY-MM-DD');
    helper.setValue(data ?? newValue);
  };
  const renderCustomDay = (
    day: Dayjs,
    selectedDays: Dayjs[],
    pickersDayProps: PickersDayProps<Dayjs>
  ) => {
    const { children, ...restProps } = pickersDayProps;
    return (
      <PickersDay
        {...restProps}
        sx={{ fontSize: '13px' }}
        onClick={() => handleDateChange(day)}
      >
        {children}
      </PickersDay>
    );
  };
  return (
    <QuestionLayout question={question} meta={meta}>
      <FormControl
        fullWidth
        error={meta.touched && Boolean(meta.error)}
        hiddenLabel
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            inputFormat="DD.MM.YYYY"
            disabled={question.readonly}
            {...field}
            onChange={handleDateChange}
            renderInput={(params) => <TextField variant="filled" {...params} />}
            renderDay={renderCustomDay}
          />
        </LocalizationProvider>
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
