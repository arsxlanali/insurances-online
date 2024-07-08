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

export default function DefaultDateSelection() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { commencementDate } = useAppSelector((state) => state.contribution);
  const step = useAppSelector((state) => state.stepper.steps);

  const initialValue = commencementDate
    ? dayjs(commencementDate)
    : dayjs().add(1, 'month').startOf('month');

  const [value, setValue] = useState<Dayjs | null>(initialValue);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(dateCommencement(value?.format('YYYY-MM-DD').substring(0, 10)));
  }, [dispatch, value]);

  useEffect(() => {
    if (modalOpen) {
      setTimeout(() => {
        setModalOpen(false);
      }, 5000);
    }
  }, [modalOpen]);

  const handleChange = (newValue: Dayjs | null) => {
    if (newValue) {
      const selectedDate = newValue.format('YYYY-MM-DD');
      const currentDate = dayjs().format('YYYY-MM-DD');
      if (selectedDate < currentDate) {
        setModalOpen(true);
      }
    }
    dispatch(dateCommencement(newValue?.format('YYYY-MM-DD').substring(0, 10)));
    setValue(newValue);
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
              label="Beginn der Versicherung"
              inputFormat="DD.MM.YYYY"
              value={commencementDate}
              onError={handleError}
              onChange={handleChange}
              disabled={step === 2}
              renderInput={(params: any) => (
                <TextField id="standard-basic" variant="filled" {...params} />
              )}
              renderDay={renderCustomDay}
            />
            <FormHelperText>TT . MM . JJJJ</FormHelperText>
          </LocalizationProvider>
        </FormControl>
      </Grid>
    </Grid>
  );
}
