import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Grid,
  FormControl,
  Divider,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker, PickersDay } from '@mui/x-date-pickers';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../utils/hooks';
import { calculateTariffsAdditional } from '../../store/thunks/contribution.thunk';
import { SelectChangeEvent } from '@mui/material';
import { PickersDayProps } from '@mui/x-date-pickers';
import AppConsts from '../../config/appconst';
import 'dayjs/locale/de'; // Import the German locale for dayjs
import { setIsTariffClicked } from 'src/store/reducers/contribution.reducer';

dayjs.locale('de');

interface Props {
  index: number;
  lenght: number;
  removeComponent: (index: number) => void;
  birthdate: string;
  genderProp: string;
}
export default function ContributionInfo({
  removeComponent,
  index,
  lenght,
  birthdate,
  genderProp,
}: Props) {
  const initialValueBirthDate = birthdate ? dayjs(birthdate) : null;
  const [birthDate, setBirthDate] = useState<Dayjs | null>(
    initialValueBirthDate
  );
  const [date, setDate] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { commencementDate, pending, personsId } = useAppSelector(
    (state) => state.contribution
  );
  const handleDateChange = (newValue: Dayjs | null) => {
    setDate(newValue?.format('YYYY-MM-DD').substring(0, 10));
    setBirthDate(newValue);
  };
  const [gender, setGender] = useState(genderProp);

  const handleGender = (event: SelectChangeEvent) => {
    setGender(event.target.value);
  };
  useEffect(() => {
    if (!pending) setIsLoading(false);
  }, [pending]);
  const calculateTariffsHandle = () => {
    dispatch(setIsTariffClicked());
    setIsLoading(true);
    dispatch(
      calculateTariffsAdditional({
        Id: personsId[index - 1],
        data: {
          customer: {
            birthday: date,
            gender: gender,
            maritalStatus: AppConsts.maritalStatus,
            occupationGroup: AppConsts.occupationGroup,
          },
          responseDescription: AppConsts.responseDescription,
          startDate: commencementDate,
        },
      })
    );
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
    <>
      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        marginTop={2}
      >
        {lenght > 1 && (
          <Button
            startIcon={<DeleteIcon />}
            onClick={() => removeComponent(index)}
          >
            Person entfernen
          </Button>
        )}
      </Grid>

      <Grid
        container
        spacing={2}
        marginBottom={2}
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              localeText={{ start: 'Gebrutsdatum' }}
            >
              <DatePicker
                inputFormat="DD.MM.YYYY"
                label="Geburtsdatum"
                disableFuture
                value={birthDate}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField
                    id="standard-basic"
                    variant="filled"
                    {...params}
                    helperText="TT . MM . JJJJ"
                  />
                )}
                renderDay={renderCustomDay}
              />
            </LocalizationProvider>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl variant="filled" fullWidth>
            <InputLabel id="demo-simple-gender-filled-label">
              Geschlecht
            </InputLabel>
            <Select
              labelId="demo-simple-gender-filled-label"
              id="demo-simple-gender-filled"
              value={gender}
              onChange={handleGender}
            >
              <MenuItem value="MALE">Männlich</MenuItem>
              <MenuItem value="FEMALE">Weiblich</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={4}
          sx={{
            display: 'flex',
            flexDirection: 'row-reverse',
          }}
        >
          <FormControl sx={{ width: '200px' }}>
            <Button
              variant="contained"
              size="large"
              onClick={calculateTariffsHandle}
              disabled={!date || pending || !gender || commencementDate === "Invalid Da"}
            >
              Tarife anzeigen
            </Button>
          </FormControl>
        </Grid>
      </Grid>
      <Divider />
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px',
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
}
