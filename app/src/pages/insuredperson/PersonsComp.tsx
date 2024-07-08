import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import {
  FormControl,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Grid,
  Button,
  FormHelperText,
  Box,
  CircularProgress,
  Checkbox,
  Alert,
  Snackbar,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  useAppDispatch,
  useAppSelector,
  useInsuranceRisk,
} from 'src/utils/hooks';
import { startRiskCheckAdditional } from 'src/store/thunks/riskCheck.thunk';
import {
  addQuestionaire,
  setOpenNoticeFalse,
  setOpenNoticeTrue,
} from 'src/store/reducers/riskCheck.reducer';
import { decrementStep } from 'src/store/reducers/stepper.reducers';
import DynamicForm from './DynamicForm';
import { useEffect, useRef, useState } from 'react';
import Person from 'src/components/Person';
import { PickersDayProps } from '@mui/x-date-pickers';
import { PickersDay } from '@mui/x-date-pickers';
import CorrectInformationOnly from './CorrectInfromationOnly';
import { saveTitle } from 'src/store/reducers/contribution.reducer';
import specialHint from 'src/config/specialHint.json';
import ReactGA from 'react-ga4';

import 'dayjs/locale/de'; // Import the German locale for dayjs
import { findHints } from 'src/utils';

dayjs.locale('de');

const validationSchema = yup.object({
  firstName: yup.string().required('Eingabe erforderlich.'),
  lastName: yup.string().required('Eingabe erforderlich.'),
  acknowledge: yup
    .boolean()
    .oneOf([true], 'Bitte bestätigen.')
    .required('Bitte bestätigen.'),
});

interface Props {
  bithdate: string;
  gender: string;
  index: number;
}
export default function Personscomp({ bithdate, gender, index }: Props) {
  const personRef = useRef<null | HTMLDivElement>(null);
  const { isDownloading } = useAppSelector((state) => state.riskCheck);
  const { openNotice } = useAppSelector(
    (state) => state.riskCheck.selectedInsurences[index - 1]
  );
  const riskIdxState = useAppSelector(
    (state) => state.riskCheck.selectedInsurences[index - 1].riskCheckIdx
  );
  const [insuranceRiskArray, person, riskIdx, options] = useInsuranceRisk(
    index,
    riskIdxState
  );
  const insuranceRisk = insuranceRiskArray[riskIdx];

  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      firstName:
        insuranceRisk?.questionnaire?.questionaryValues?.find(
          ({ key }) => key === 'firstName'
        )?.value ?? '',
      lastName:
        insuranceRisk?.questionnaire?.questionaryValues?.find(
          ({ key }) => key === 'familyName'
        )?.value ?? '',
      acknowledge: false,
    },
    validationSchema: validationSchema,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      if (insuranceRisk?.questionnaire) {
        dispatch(setOpenNoticeFalse({ personIdx: index - 1 }));
      } else {
        dispatch(
          addQuestionaire({ personIdx: index - 1, values: { ...values } })
        );
        if (process.env.REACT_APP_ENV === 'production') {
          ReactGA.event({
            category: 'events',
            action: `S:${insuranceRisk.option.symbol}-${insuranceRisk.option.displayString}`,
          });
        }
        dispatch(
          saveTitle({
            personId: person.Id,
            title: `(${values.firstName} ${values.lastName}, geboren am ${dayjs(
              bithdate
            ).format('DD.MM.YYYY')})`,
            firstName: values.firstName,
            lastName: values.lastName,
          })
        );
        dispatch(
          startRiskCheckAdditional({
            Id: person.Id,
            riskIdx: riskIdx,
            personIdx: index - 1,
            values: {
              firstName: values.firstName,
              familyName: values.lastName,
            },
          } as RiskCheckThunkProps)
        );
      }
    },
  });

  useEffect(() => {
    if (insuranceRisk?.moreQuestions) {
      personRef.current?.scrollIntoView();
    }
  }, [insuranceRisk?.moreQuestions]);

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    let timer: any;
    if (insuranceRisk?.loading || isDownloading) {
      timer = setTimeout(() => {
        setShowToast(true);
      }, 30000);
    } else {
      clearTimeout(timer);
      setShowToast(false);
    }
    return () => clearTimeout(timer);
  }, [insuranceRisk?.loading, isDownloading]);

  const [value, setValue] = useState<Dayjs | null>(dayjs(bithdate));
  const name = [formik.values.firstName, formik.values.lastName]
    .filter((v) => v)
    .join(' ');

  const handleDateChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

  const renderCustomDay = (
    day: Dayjs,
    _: Dayjs[],
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

  const hintsArray: SpecialHint[] = findHints(specialHint, insuranceRisk);
  let showHint: SpecialHint | undefined = hintsArray.find(
    (hint) => hint.tariffId === insuranceRisk.option.tarrifId
  );
  if (!showHint && hintsArray.length > 0) {
    showHint = hintsArray[0];
  }

  return (
    <Person
      index={index}
      title={`(${name ? name + ', ' : ''} geboren am ${dayjs(bithdate).format(
        'DD.MM.YYYY'
      )})`}
      personRef={personRef}
      options={options}
      defaultExpanded={false}
      riskIndex={riskIdx + 1}
      showCompletedTariffs={false}
    >
      <>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} paddingY={3}>
            {openNotice && <Grid xs={12} paddingLeft={2}></Grid>}

            <Grid item xs={12}>
              <FormControl>
                <RadioGroup
                  row
                  defaultValue={gender.toUpperCase()}
                  name="Gender Radio"
                >
                  <FormControlLabel
                    value="MALE"
                    disabled
                    sx={{
                      '& .MuiSvgIcon-root': {
                        fontSize: 24,
                      },
                    }}
                    control={<Radio />}
                    label="Herr"
                  />
                  <FormControlLabel
                    value="FEMALE"
                    disabled
                    sx={{
                      '& .MuiSvgIcon-root': {
                        fontSize: 24,
                      },
                    }}
                    control={<Radio />}
                    label="Frau"
                  />
                </RadioGroup>
                <FormHelperText sx={{ margin: 0 }}>
                  Für Änderung bitte einen Schritt zurück.
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid
              container
              spacing={2}
              marginY={1}
              marginX={0}
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <TextField
                    id="standard-basic"
                    label="Vorname"
                    variant="filled"
                    disabled={!!insuranceRisk?.questionnaire}
                    {...formik.getFieldProps('firstName')}
                    error={
                      formik.touched.firstName &&
                      Boolean(formik.errors.firstName)
                    }
                    helperText={
                      formik.touched.firstName && formik.errors.firstName
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <TextField
                    id="standard-basic"
                    label="Nachname"
                    variant="filled"
                    disabled={!!insuranceRisk?.questionnaire}
                    {...formik.getFieldProps('lastName')}
                    error={
                      formik.touched.lastName && Boolean(formik.errors.lastName)
                    }
                    helperText={
                      formik.touched.lastName && formik.errors.lastName
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Geburtsdatum"
                      inputFormat="DD.MM.YYYY"
                      disabled
                      value={value}
                      onChange={handleDateChange}
                      renderInput={(params) => (
                        <TextField variant="filled" disabled {...params} />
                      )}
                      renderDay={renderCustomDay}
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>
              {openNotice && showHint !== undefined && (
                <Grid xs={12} paddingLeft={2} paddingTop={4}>
                  <Alert
                    severity="warning"
                    sx={{ width: '100%', alignItems: 'center' }}
                  >
                    {showHint?.specialHint}
                  </Alert>
                </Grid>
              )}
              {openNotice && (
                <Grid xs={12} paddingLeft={2} paddingTop={4}>
                  <Alert
                    severity="info"
                    sx={{ width: '100%', alignItems: 'center' }}
                  >
                    <FormControl>
                      <FormControlLabel
                        control={
                          <Checkbox {...formik.getFieldProps('acknowledge')} />
                        }
                        label={<CorrectInformationOnly />}
                      />
                    </FormControl>
                    {formik.touched.acknowledge &&
                      formik.errors.acknowledge && (
                        <FormHelperText error>
                          {formik.errors.acknowledge}
                        </FormHelperText>
                      )}
                  </Alert>
                </Grid>
              )}
              <Grid
                item
                xs={12}
                display={
                  insuranceRisk?.questionnaire && !openNotice ? 'none' : 'flex'
                }
                flexDirection={'row-reverse'}
                justifyContent={'space-between'}
              >
                <FormControl sx={{ width: '200px' }}>
                  <Button
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={
                      !formik.isValid || showHint?.blocksNextStep
                        ? showHint?.blocksNextStep
                        : false
                    }
                    sx={{ px: 0 }}
                  >
                    BEANTRAGUNG STARTEN
                  </Button>
                </FormControl>
                <FormControl>
                  <Button
                    variant="contained"
                    onClick={() => {
                      dispatch(setOpenNoticeTrue({ personIdx: index - 1 }));
                      dispatch(decrementStep());
                    }}
                  >
                    Zurück
                  </Button>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </form>
        {showToast && (
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={showToast}
          >
            <Alert severity="warning">
              Wir haben aktuell Probleme mit der Anbindung festgestellt,
              versuchen aber, diese zu lösen. Bitte haben Sie einen Moment
              Geduld.
            </Alert>
          </Snackbar>
        )}
        {insuranceRisk?.loading || isDownloading ? (
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
        ) : (
          insuranceRisk?.questionnaire &&
          !openNotice && (
            <DynamicForm
              questionaire={insuranceRisk.questionnaire}
              submitText="Weiter"
              readonly={false}
              personId={person.Id}
              personIdx={index}
              riskIdx={riskIdx}
            />
          )
        )}
      </>
    </Person>
  );
}
