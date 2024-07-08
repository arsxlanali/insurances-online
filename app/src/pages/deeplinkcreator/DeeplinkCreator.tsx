import {
  Autocomplete,
  Button,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  TextField,
  Box,
  Grid,
  Select,
  Typography,
} from '@mui/material';
import { Container } from '@mui/system';
import { Field, FieldProps, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import AgentDialog from 'src/components/AgentDialog';
import { HomeIcon } from 'src/components/HomeIcon';
import { getInsurer, getTariffs } from 'src/store/thunks/deeplink.thunk';
import { REACT_APP_TARIFFTYPES } from 'src/utils/constants';
import { useAppDispatch, useAppSelector } from 'src/utils/hooks';
import mandants from '../../config/mandant';
import PersonInfo from '../confirmation/PersonInfo';
import DeeplinkDialog from './DeeplinkDialog';
import { initialValues, generateDeeplink } from '.';
import { getURLShorten } from 'src/api/DeeplinkAPI';

export default function DeeplinkCreator() {
  const [open, setOpen] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [deeplinkUrl, setDeeplinkUrl] = useState<string>('');
  const [insurerSelected, setInsurerSelected] = useState(true);

  const { mandant, customFields } = useAppSelector((state) => state.config);
  const { insurers } = useAppSelector((state) => state.deeplink);
  const { tariffs } = useAppSelector((state) => state.deeplink);

  type Mandant = keyof typeof mandants;
  const insurerIds = mandants[mandant as Mandant]?.allowedAgentNumbers || [];

  const { agentNumberValidation } = mandants[mandant as Mandant] || {};
  const predefineRemarks = mandants[mandant as Mandant]?.remarks;
  const initialValuesPredefine: InitialValues = {
    ...initialValues,
    remarks: predefineRemarks ?? '',
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (mandant !== '') dispatch(getInsurer());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mandant]);

  const validateDeeplink = (values: InitialValues) => {
    const errors: Partial<InitialValues> = {};
    if (agentNumberValidation?.validation) {
      const { validation, errorMessage } = agentNumberValidation;
      const regex1 = new RegExp(validation);
      if (
        !regex1?.test(values.agentNumber1.toString()) &&
        validation &&
        errorMessage
      ) {
        errors.agentNumber1 = errorMessage;
      }
    }
    if (agentNumberValidation?.validation2) {
      const { validation2, errorMessage2 } = agentNumberValidation;
      const regex1 = new RegExp(validation2);
      if (
        !regex1?.test(values.agentNumber2.toString()) &&
        validation2 &&
        errorMessage2
      ) {
        errors.agentNumber2 = errorMessage2;
      }
    }

    return errors;
  };

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        paddingBottom: '50px',
        width: {
          sm: '95vw',
          md: '900px',
        },
      }}
    >
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Box display="flex" width="100%" flexDirection="column-reverse">
            <HomeIcon />
          </Box>
          <Typography
            variant="h6"
            sx={{ marginBottom: 2 }}
            color="primary.main"
          >
            Link Generator für Onlineabschlüsse
          </Typography>
          <Typography sx={{ marginY: 5 }}>
            Bitte stellen Sie sicher, dass Sie bei der Gesellschaft Geschäft
            einreichen dürfen. Die letztendliche Verifikation findet auf der
            Seite der Gesellschaft statt. Sollten Sie dort keine Freischaltung
            haben, wenden Sie sich bitte an diese.
            <br />
            <br />
            Der Link-Generator erzeugt einen Onlineabschluss-Link, der mit Ihrer
            Vermittlernummer verknüpft ist, so dass der mit diesem Link
            getätigte Abschluss in Ihrem Namen bei der Gesellschaft eingereicht
            wird.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <div
            style={{
              borderLeft: '4px solid #f8f8f8',
              borderRight: '4px solid #f8f8f8',
              boxShadow: '0px 14px 22px -2px rgba(0,0,0,0.68)',
            }}
          >
            <div style={{ backgroundColor: 'white', padding: '1rem' }}>
              <Formik
                initialValues={initialValuesPredefine}
                validate={validateDeeplink}
                enableReinitialize={true}
                onSubmit={async (values, { setSubmitting }) => {
                  if (
                    !insurerIds.length ||
                    insurerIds.includes(`${values?.agentNumber1}`) ||
                    insurerIds.includes(`${values?.agentNumber2}`)
                  ) {
                    const genetatedUrl = generateDeeplink(
                      values,
                      tariffs,
                      customFields
                    );
                    try {
                      const response = await getURLShorten(genetatedUrl);
                      if (process.env.REACT_APP_ENV === 'production') {
                        ReactGA.event({
                          category: 'events',
                          action: `D: ${values.agentNumber1} ${values.agentNumber2}`,
                        });
                      }
                      setDeeplinkUrl(response?.data?.data?.tiny_url);
                      setSubmitting(false);
                      setOpen(true);
                    } catch (error) {
                      console.error('Error shortening URL:', error);
                    }
                  } else {
                    setOpenDialog(true);
                  }
                }}
              >
                {({
                  values,
                  handleChange,
                  handleBlur,
                  isSubmitting,
                  setFieldValue,
                  touched,
                  errors,
                }) => {
                  const contact: AgentData = {
                    agentNumber1: values.agentNumber1,
                    agentNumber2: values.agentNumber2,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    company: values.company,
                    street: values.street,
                    zipcode: values.zipcode,
                    city: values.city,
                    phone: values.landlineNumber,
                    mobile: values.mobile.toString(),
                    email: values.email,
                  };
                  return (
                    <Form>
                      <FormControl fullWidth sx={{ marginBottom: 1 }}>
                        <TextField
                          id="agentNumber1"
                          label="Vermittlernummer 1"
                          variant="filled"
                          type="text"
                          required
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.agentNumber1}
                        />
                        {touched.agentNumber1 && errors.agentNumber1 && (
                          <FormHelperText error>
                            {errors.agentNumber1}
                          </FormHelperText>
                        )}
                      </FormControl>

                      <FormControl fullWidth sx={{ marginBottom: 1 }}>
                        <TextField
                          id="agentNumber2"
                          label="Vermittlernummer 2"
                          variant="filled"
                          type="text"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.agentNumber2}
                        />
                        {touched.agentNumber2 && errors.agentNumber2 && (
                          <FormHelperText error>
                            {errors.agentNumber2}
                          </FormHelperText>
                        )}
                      </FormControl>

                      <FormControl
                        variant="filled"
                        fullWidth
                        sx={{ marginBottom: 1 }}
                      >
                        <InputLabel required>Versicherer</InputLabel>
                        <Select
                          name="insurer"
                          required
                          value={values.insurer}
                          onChange={(e) => {
                            const insurer = [e.target.value];
                            const tarifftypes = [...values.tariffsType].join(
                              ','
                            );
                            dispatch(getTariffs({ insurer, tarifftypes }));
                            handleChange(e);
                            if (insurer.length > 0) {
                              setInsurerSelected(false);
                            } else {
                              setInsurerSelected(true);
                            }
                          }}
                        >
                          {insurers?.map((insurer, index) => (
                            <MenuItem key={index} value={insurer.id}>
                              {insurer.value}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Typography sx={{ marginY: 1 }}>
                        Die Auswahl der Tariftypen und konkreter Tarife ist
                        optional. Lassen Sie die Auswahl leer, wenn Sie alle
                        Tariftypen und alle Tarife des ausgewählten Versicherers
                        anzeigen lassen wollen.
                      </Typography>
                      <FormControl
                        variant="filled"
                        fullWidth
                        sx={{ marginY: 1 }}
                      >
                        <Autocomplete
                          multiple
                          id="tarifftypes"
                          options={REACT_APP_TARIFFTYPES.map(
                            (tariff) => tariff.type
                          )}
                          defaultValue={values.tariffsType}
                          disabled={insurerSelected}
                          freeSolo
                          renderTags={(value, getTagProps) => {
                            return value.map((option, index) => (
                              <Chip
                                variant="outlined"
                                label={option}
                                {...getTagProps({ index })}
                              />
                            ));
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="filled"
                              label="Tariftypen"
                            />
                          )}
                          onChange={(e, selectedOptions) => {
                            setFieldValue('tariffsType', [...selectedOptions]);
                            const tarifftypes = selectedOptions.join(',');
                            const insurer = [values.insurer];
                            dispatch(getTariffs({ insurer, tarifftypes }));
                            handleChange(e);
                          }}
                        />
                      </FormControl>

                      <FormControl
                        variant="filled"
                        fullWidth
                        sx={{ marginBottom: 1 }}
                      >
                        <Autocomplete
                          multiple
                          id="tariffs"
                          options={Array.from(
                            new Set(tariffs.map((tariff) => tariff.value))
                          ).sort()}
                          value={values.tariffs}
                          defaultValue={values.tariffs}
                          disabled={insurerSelected}
                          freeSolo
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                variant="outlined"
                                label={option}
                                {...getTagProps({ index })}
                              />
                            ))
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="filled"
                              label="Tarife"
                            />
                          )}
                          onChange={(_, newValue) => {
                            setFieldValue('tariffs', [...newValue]);
                          }}
                        />
                      </FormControl>

                      {customFields.map((customField, index) => (
                        <FormControl fullWidth sx={{ marginBottom: 1 }}>
                          <Field name={customField.backendField}>
                            {({ field }: { field: FieldProps }) => (
                              <TextField
                                required={customField.mandatory}
                                id={customField.id}
                                label={customField.label}
                                variant="filled"
                                {...field}
                                type={
                                  customField.type === 'Number'
                                    ? 'number'
                                    : 'text'
                                }
                              />
                            )}
                          </Field>
                        </FormControl>
                      ))}
                      <Typography sx={{ marginY: 5 }}>
                        Bitte geben Sie zusätzlich noch Ihre
                        Kontaktinformationen an. Diese werden dem Endkunden nach
                        dem Abschluss angezeigt und dienen der Kontaktaufnahme
                        des Endkunden.
                      </Typography>
                      <FormControl fullWidth sx={{ marginBottom: 1 }}>
                        <Field name="firstName">
                          {({ field }: { field: FieldProps }) => (
                            <TextField
                              required
                              id="firstName"
                              label="Vorname"
                              variant="filled"
                              {...field}
                            />
                          )}
                        </Field>
                      </FormControl>
                      <FormControl fullWidth sx={{ marginBottom: 1 }}>
                        <Field name="lastName">
                          {({ field }: { field: FieldProps }) => (
                            <TextField
                              required
                              id="lastName"
                              label="Nachname"
                              variant="filled"
                              {...field}
                            />
                          )}
                        </Field>
                      </FormControl>
                      <FormControl fullWidth sx={{ marginBottom: 1 }}>
                        <Field name="company">
                          {({ field }: { field: FieldProps }) => (
                            <TextField
                              id="company"
                              label="Firma"
                              variant="filled"
                              inputProps={{ maxLength: 50 }}
                              {...field}
                            />
                          )}
                        </Field>
                      </FormControl>
                      <FormControl fullWidth sx={{ marginBottom: 1 }}>
                        <Field name="street">
                          {({ field }: { field: FieldProps }) => (
                            <TextField
                              required
                              id="street"
                              label="Straße"
                              variant="filled"
                              {...field}
                            />
                          )}
                        </Field>
                      </FormControl>
                      <FormControl fullWidth sx={{ marginBottom: 1 }}>
                        <Field name="zipcode">
                          {({ field }: { field: FieldProps }) => (
                            <TextField
                              required
                              id="zipcode"
                              label="Postleitzahl"
                              variant="filled"
                              {...field}
                            />
                          )}
                        </Field>
                      </FormControl>
                      <FormControl fullWidth sx={{ marginBottom: 1 }}>
                        <Field name="city">
                          {({ field }: { field: FieldProps }) => (
                            <TextField
                              required
                              id="city"
                              label="Ort"
                              variant="filled"
                              {...field}
                            />
                          )}
                        </Field>
                      </FormControl>
                      <FormControl fullWidth sx={{ marginBottom: 1 }}>
                        <Field name="email">
                          {({ field }: { field: FieldProps }) => (
                            <TextField
                              id="email"
                              label="Emailadresse"
                              variant="filled"
                              type="email"
                              required
                              {...field}
                            />
                          )}
                        </Field>
                      </FormControl>
                      <FormControl fullWidth sx={{ marginBottom: 1 }}>
                        <Field name="mobile">
                          {({ field }: { field: FieldProps }) => (
                            <TextField
                              id="mobile"
                              label="Mobilfunknummer"
                              variant="filled"
                              type="tel"
                              inputMode="tel"
                              {...field}
                            />
                          )}
                        </Field>
                      </FormControl>
                      <FormControl fullWidth sx={{ marginBottom: 1 }}>
                        <Field name="landlineNumber">
                          {({ field }: { field: FieldProps }) => (
                            <TextField
                              id="landlineNumber"
                              label="Festnetznummer"
                              variant="filled"
                              {...field}
                            />
                          )}
                        </Field>
                      </FormControl>
                      <Typography sx={{ marginY: 5 }}>
                        Bitte geben Sie ebenfalls noch einen kurzen Text an, der
                        dem Endkunden nach Abschluss auf der Bestätigungseite
                        angezeigt werden soll. Dieser wird sowohl im
                        Erfolgsfall, als auch im Misserfolgsfall angezeigt und
                        sollte darauf verweisen, dass sich der Endkunde bei
                        Fragen an Sie wenden kann.
                      </Typography>
                      <FormControl fullWidth sx={{ marginBottom: 1 }}>
                        <Field name="remarks">
                          {({ field }: { field: FieldProps }) => (
                            <TextField
                              id="remarks"
                              label="Bemerkungen"
                              variant="filled"
                              disabled={predefineRemarks ? true : false}
                              multiline
                              // value={'dfakjsdhfaksjdhf'}
                              {...field}
                            />
                          )}
                        </Field>
                      </FormControl>

                      <Box>
                        <PersonInfo
                          contact={contact}
                          remarks={values?.remarks}
                          title={
                            'So wird die Kontakt-Info-Box dem Benutzer auf der Abschlussseite angezeigt:'
                          }
                        />
                      </Box>

                      <Divider />
                      <Grid
                        item
                        sx={{
                          display: 'flex',
                          paddingTop: 3,
                          flexDirection: 'row-reverse',
                        }}
                      >
                        <FormControl>
                          <Button
                            variant="contained"
                            size="large"
                            type="submit"
                            disabled={isSubmitting}
                          >
                            Link generieren
                          </Button>
                        </FormControl>
                      </Grid>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </Grid>
      </Box>
      <AgentDialog open={openDialog} setOpen={setOpenDialog} />
      <DeeplinkDialog open={open} setOpen={setOpen} url={deeplinkUrl} />
    </Container>
  );
}
