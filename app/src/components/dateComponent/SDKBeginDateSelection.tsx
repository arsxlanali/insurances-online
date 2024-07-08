import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import {
  Grid,
  FormControl,
  FormHelperText,
  Alert,
  Snackbar,
} from '@mui/material';
import { PickersDay } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers';
import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { dateCommencement } from '../../store/reducers/contribution.reducer';
import { PickersDayProps } from '@mui/x-date-pickers';
dayjs.locale('de');

export default function SDKBeginDateSelection() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { commencementDate } = useAppSelector((state) => state.contribution);
  const step = useAppSelector((state) => state.stepper.steps);

  const [value, setValue] = useState<Dayjs | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (commencementDate) {
      setValue(dayjs(commencementDate));
    }
  }, [commencementDate]);

  useEffect(() => {
    if (modalOpen) {
      setTimeout(() => {
        setModalOpen(false);
      }, 5000);
    }
  }, [modalOpen]);

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
    dispatch(dateCommencement(newValue?.format('YYYY-MM-DD').substring(0, 10)));
  };

  const handleError = (e: any) => {
    e !== null && dispatch(dateCommencement('Invalid Da'));
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
        onClick={() => handleChange(day)}
      >
        {children}
      </PickersDay>
    );
  };

  const currentDate = dayjs();
  let minSelectableDate = currentDate.startOf('month');
  let maxSelectableDate = currentDate.add(6, 'month').startOf('month');
  if (currentDate.date() > 15) {
    minSelectableDate = minSelectableDate.add(1, 'month');
  }

  return (
    <Grid
      container
      spacing={2}
      paddingTop={2}
      paddingBottom={2}
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={modalOpen}
      >
        <Alert severity="info" sx={{ width: '100%' }}>
          Bitte beachten Sie, dass die Rückdatierung eines Antrags nicht bei
          allen Versicherern möglich ist.
        </Alert>
      </Snackbar>
      <Grid item xs={12} sm={6} md={4}>
        <FormControl fullWidth>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="deDE">
            <DatePicker
              onError={handleError}
              label="Beginn der Versicherung"
              inputFormat="DD.MM.YYYY"
              value={value}
              onChange={handleChange}
              disabled={step === 2}
              shouldDisableDate={(date) => {

                const currentDate = dayjs();
                const currentDay = currentDate.date();
                const selectedDate = date ? dayjs(date) : null;

                // Disable all dates other than the 1st of each month
                if (selectedDate && selectedDate.date() !== 1) {
                  return true;
                }

                // Disable the 1st of the current month if the current day is between the 16th and end of month
                if (selectedDate && currentDay >= 16 && currentDay <= currentDate.endOf('month').date() && selectedDate.month() === currentDate.month()) {
                  return true;
                }

                // Enable the 1st of the current month if the current day is between the 1st and 15th
                if (selectedDate && currentDay >= 1 && currentDay <= 15 && selectedDate.month() === currentDate.month()) {
                  return false;
                }

                // Disable dates beyond 6 months in the future
                if (selectedDate && selectedDate.isAfter(maxSelectableDate)) {
                  return true;
                }

                return false;
              }}

              renderInput={(params: any) => (
                <TextField id="standard-basic" variant="filled" {...params} />
              )}
              renderDay={renderCustomDay}
              minDate={dayjs(minSelectableDate.toDate())}
              maxDate={dayjs(maxSelectableDate.toDate())}
            />
            <FormHelperText>TT . MM . JJJJ</FormHelperText>
          </LocalizationProvider>
        </FormControl>
      </Grid>
    </Grid>
  );
}
