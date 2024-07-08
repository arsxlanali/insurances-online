import { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  TextField,
  Button,
  Modal,
  Box,
  FormControl,
  MenuItem,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useAppDispatch, useAppSelector } from 'src/utils/hooks';
import { addQuestionaire } from 'src/store/reducers/riskCheck.reducer';
import * as SendEmailAPI from 'src/api/SendEmailAPI';
import { showSuccess } from 'src/utils/toast';
import AppConsts from 'src/config/appconst';
import mandants from 'src/config/mandant';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLoader: React.Dispatch<React.SetStateAction<boolean>>;
  loader: boolean;
  dropdownOptions: any;
  dropdownFlag: boolean;
}

export default function EmailModal({
  open,
  setOpen,
  dropdownOptions,
  dropdownFlag,
  setLoader,
  loader,
}: Props) {
  const [personIndex, setPersonIndex] = useState(
    dropdownFlag ? '' : dropdownOptions[0]?.key
  );
  const { mandant } = useAppSelector((state) => state.config);

  type Mandant = keyof typeof mandants;
  const sendAttachments = mandants[mandant as Mandant].sendAttachments;

  const parts = useAppSelector(
    (state) => state.contribution.commencementDate
  ).split('-');
  // Rearrange the parts to format as "DD.MM.YYYY"
  const commencementDate = `${parts[2]}.${parts[1]}.${parts[0]}`;

  const selectedInsurences = useAppSelector(
    (state) => state.riskCheck.selectedInsurences
  );
  const agentContact = useAppSelector((state) => state.config.agentData);
  const [email, setEmail] = useState('');
  const dispatch = useAppDispatch();

  const handleChange = (event: SelectChangeEvent) => {
    setPersonIndex(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setPersonIndex(dropdownOptions[0]?.key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownFlag]);

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: { xs: '90vw', sm: 600 } }}>
          <Typography variant="h5" marginBottom={'10px'}>
            Eingangsbestätigung per Email erhalten
          </Typography>
          <Typography variant="body1">
            Wir haben festgestellt, dass der Versicherer keine Email-Adresse
            abgefragt hat. Neben dem Download der Dokumente auf der
            Bestätigungsseite, können Sie sich eine Eingangsbestätigung auch per
            Email zusenden. Geben Sie dazu einfach hier Ihre Emailadresse ein
            und klicken anschließend auf „Zusenden“.
          </Typography>

          <Grid container spacing={2} paddingTop="20px">
            <Grid item xs={12} sm={dropdownFlag ? 6 : 8}>
              <TextField
                fullWidth
                sx={{ height: '40px' }}
                label="Email"
                id="user-email"
                value={email}
                variant="filled"
                size="small"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            {dropdownFlag && (
              <Grid item xs={3}>
                <FormControl variant="filled" size="small" fullWidth>
                  <InputLabel id="demo-simple-select-standard-label">
                    Person Name
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={personIndex}
                    onChange={handleChange}
                    label="personIndex"
                  >
                    {dropdownOptions.map((option: any) => (
                      <MenuItem value={option.key}>{option.value}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid
              item
              xs={12}
              sm={dropdownFlag ? 3 : 4}
              display="flex"
              justifyContent="end"
            >
              <Button
                fullWidth
                disabled={!email || !personIndex}
                onClick={() => {
                  dispatch(
                    addQuestionaire({
                      personIdx: parseInt(personIndex),
                      values: { eMail: email },
                    })
                  );
                  selectedInsurences[personIndex].riskCheckOptions.forEach(
                    (insurace) => {
                      const { eMail, firstName, lastName } =
                        selectedInsurences[personIndex].previousQuestionaire;
                      const orderAccepted =
                        insurace?.questionnaire?.riskCheckStatus ===
                        AppConsts.orderAccepted;

                      const documentQuestions: string[] = [];
                      insurace?.questionnaire?.questionaryValues.forEach(
                        (q) => {
                          if (q.key.match(/downloadLnDocument_(\d+)/)) {
                            documentQuestions.push(
                              q.key.substring(q.key.lastIndexOf('_') + 1)
                            );
                          }
                        }
                      );
                      if (!eMail && orderAccepted) {
                        const riskCheckData = {
                          email,
                          name: `${firstName} ${lastName}`,
                          tariff: insurace.option.displayString,
                          tariffId: insurace.option.tarrifId,
                          price: insurace.option.fee,
                          insranceName: insurace.option?.insuranceName,
                          benefitExclusion:
                            insurace.option?.orderAcceptedBenefitExclusion,
                          additionalFee:
                            insurace.option?.orderAcceptedAdditionalFee,
                          additionalFeeReason:
                            insurace.option?.orderAcceptedAdditionalFeeReason,
                          differentFee:
                            insurace.option?.orderAcceptedDifferentFee,
                          applicationNumber:
                            insurace.questionnaire?.referenceId,
                          riskCheckId:
                            insurace.questionnaire?.riskCheckId ?? '',
                          documentQuestions,
                        };

                        const agentData = {
                          ...agentContact,
                          commencementDate,
                          ...riskCheckData,
                        };
                        const customTempalteClient =
                          mandants[mandant as Mandant]?.customTemplate
                            ?.client ??
                          (process.env
                            .REACT_APP_EMAIL_TEMPLATE_DEFAULT_CLIENT ||
                            '');
                        setLoader(true);
                        SendEmailAPI.sendEmail(
                          agentData,
                          riskCheckData.email,
                          `Eingangsbestätigung Ihres Versicherungsantrags ${riskCheckData?.applicationNumber}`,
                          mandant,
                          riskCheckData?.riskCheckId,
                          riskCheckData?.tariffId,
                          riskCheckData.documentQuestions,
                          sendAttachments?.client,
                          customTempalteClient
                        ).then(() => {
                          setLoader(false);
                          showSuccess('E-Mail wurde erfolgreich gesendet');
                        });
                      }
                    }
                  );
                  setEmail('');
                }}
                endIcon={
                  loader ? (
                    <CircularProgress size={20} color="primary" />
                  ) : (
                    <SendIcon />
                  )
                }
                variant="contained"
              >
                {' '}
                {loader ? 'Senden' : 'Zusenden'}
              </Button>
            </Grid>
            <Grid item xs={dropdownFlag ? 9 : 8}></Grid>
            <Grid
              item
              xs={dropdownFlag ? 3 : 4}
              display="flex"
              justifyContent="end"
            >
              <Button fullWidth onClick={handleClose} variant="outlined">
                Fertig
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
