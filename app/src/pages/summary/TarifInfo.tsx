import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import RiskInfoComponent from 'src/components/RiskInfoComponent';
import TooltipReusable from 'src/components/TooltipReusable';
import AppConsts from 'src/config/appconst';
import { downloadDocument, getTextColor, hexToRgba } from 'src/utils';
import { useAppSelector } from 'src/utils/hooks';
import { formatNumber } from 'src/utils/numberFormater';
interface Props {
  options: ContributionOptionExclusive[];
  riskIndex?: number;
  index: number;
  showCompletedTariffs: boolean;
}

export default function TarifInfo({
  options,
  riskIndex,
  index,
  showCompletedTariffs,
}: Props) {
  const riskCheckArray = useAppSelector(
    (state) => state.riskCheck.selectedInsurences[index].riskCheckOptions
  );
  const { mandant } = useAppSelector((state) => state.config);
  const textColor = getTextColor(mandant);
  const activeStep = riskIndex ? riskIndex - 1 : options.length;

  return (
    <Stepper
      activeStep={activeStep}
      orientation="vertical"
      sx={{
        '& .MuiStepConnector-line': { display: 'none' },

        '& .Mui-active': {
          '& .MuiStepIcon-text': {
            fill: (theme: Theme) => {
              if (theme.palette.customInfoIconColor) {
                return theme.palette.customInfoIconColor.text;
              } else {
                return 'white';
              }
            },
          },
          color: (theme: Theme) => {
            if (theme.palette.customInfoIconColor) {
              return `${theme.palette.customInfoIconColor.main} !important`;
            } else {
              return theme.palette.primary.main;
            }
          },
        },
      }}
    >
      {options.map((option, idx) => {
        const labelProps: {
          active?: boolean;
          error?: boolean;
          completed?: boolean;
        } = {};
        if (showCompletedTariffs) {
          if (
            riskCheckArray[idx].questionnaire?.riskCheckStatus !==
            AppConsts.orderAccepted
          ) {
            labelProps.error = true;
          } else {
            labelProps.completed = true;
          }
        }

        const style: SxProps<Theme> = labelProps.completed
          ? {
              backgroundColor: (theme) =>
                hexToRgba(theme.palette.secondary.main, 0.75),
              borderRadius: 2,
            } // Apply style for completed step
          : riskIndex && idx === riskIndex - 1 // Check if it's the active step
          ? {
              backgroundColor: (theme) =>
                hexToRgba(theme.palette.secondary.main, 0.75),
              borderRadius: 2,
            } // Apply style for active step using theme callback
          : {};

        const styleDiv = labelProps.completed
          ? { color: textColor } // Apply style for completed step
          : riskIndex && idx === riskIndex - 1 // Check if it's the active step
          ? { color: textColor } // Apply style for active step
          : { color: 'text.dark' };

        return (
          <Step key={option.id}>
            <StepLabel {...labelProps} sx={{ paddingX: 1, ...style }}>
              <Stack direction={{ sm: 'column', md: 'row' }}>
                <Grid container>
                  <Grid
                    container
                    item
                    sm={12}
                    xs={10}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={styleDiv}
                  >
                    <Grid item sm={4} xs={12} paddingY={1}>
                      {option.insuranceName}
                    </Grid>
                    <Grid item sm={3} xs={12} paddingY={1}>
                      {option.displayString}
                    </Grid>
                    <Grid item sm={2} display={{ xs: 'none', sm: 'initial' }}>
                      <TooltipReusable
                        isActive={activeStep === idx}
                        personIdx={index}
                        tarrifId={option.tarrifId}
                        title={Object.values(option.descriptions)}
                      />
                    </Grid>
                    <Grid
                      item
                      sm={3}
                      xs={12}
                      paddingY={1}
                      fontStyle={'italic'}
                      display="flex"
                      alignItems={'center'}
                    >
                      <Box
                        sx={
                          option?.orderAcceptedAdditionalFee ||
                          option.orderAcceptedDifferentFee
                            ? { textDecoration: 'line-through' }
                            : {}
                        }
                      >
                        {formatNumber(option.fee)} EUR / Monat
                      </Box>
                      {option?.orderAcceptedDifferentFee && (
                        <>
                          <Box paddingLeft={3}>
                            {formatNumber(
                              parseFloat(
                                option?.orderAcceptedDifferentFee.replace(
                                  ',',
                                  '.'
                                )
                              )
                            )}{' '}
                            EUR / Monat
                          </Box>
                          <Box>
                            <TooltipReusable
                              title={[
                                `Der neue Preis inkludiert einen Zuschlag in Höhe von ${
                                  option.orderAcceptedAdditionalFee ??
                                  formatNumber(
                                    parseFloat(
                                      option.orderAcceptedDifferentFee.replace(
                                        ',',
                                        '.'
                                      )
                                    ) - option.fee
                                  )
                                } EUR / Monat${
                                  option.orderAcceptedAdditionalFeeReason !==
                                  null
                                    ? ` als ${option.orderAcceptedAdditionalFeeReason}`
                                    : '.'
                                }`,
                              ]}
                              iconFlag={false}
                            />
                          </Box>
                        </>
                      )}
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    justifyContent={'center'}
                    alignItems={'center'}
                    display={{ sm: 'none', xs: 'flex' }}
                  >
                    <TooltipReusable
                      personIdx={index}
                      isActive={activeStep === idx}
                      tarrifId={option.tarrifId}
                      title={Object.values(option.descriptions)}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </StepLabel>
            {showCompletedTariffs && (
              <Box marginY={2}>
                <Grid container marginY={2}>
                  <Grid item>
                    <Typography>
                      Der Versicherer hat Ihren verbindlichen Antrag mit der
                      Antragsnummer{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {riskCheckArray[idx].questionnaire?.referenceId}
                      </span>{' '}
                      entgegengenommen.
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
            {showCompletedTariffs && (
              <RiskInfoComponent riskIndex={idx + 1} options={options} />
            )}
            {showCompletedTariffs &&
              riskCheckArray[idx].questionnaire?.documents.length !== 0 &&
              riskCheckArray[idx].questionnaire?.documents.map(
                (document, index) => {
                  return (
                    <Box marginY={2}>
                      {index === 0 && (
                        <Typography
                          variant="h6"
                          sx={{
                            paddingBottom: 3,
                            pr: 5,
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Ihre Dokumente:
                        </Typography>
                      )}
                      <Grid
                        container
                        alignItems={'center'}
                        justifyContent={'space-between'}
                        marginBottom={2}
                      >
                        <Grid item>
                          <Typography>{document.displayName}</Typography>
                        </Grid>
                        <Grid item>
                          <Button
                            key={document.documentId}
                            variant="contained"
                            color="primary"
                            // disabled={field.value === 'true' ? true : false}
                            onClick={() => {
                              downloadDocument(
                                document?.content,
                                `${document.displayName}.${document.fileType}`
                              );
                              // helpers.setValue('true');
                            }}
                          >
                            Dokument herunterladen
                          </Button>
                        </Grid>
                      </Grid>
                      {options.length !== idx + 1 && <Divider />}
                    </Box>
                  );
                }
              )}
            {riskCheckArray[idx].questionnaire?.loading && (
              <Box display={'flex'} justifyContent={'center'} paddingY={3}>
                <CircularProgress disableShrink />
              </Box>
            )}
          </Step>
        );
      })}
      {!showCompletedTariffs && options.length !== riskIndex && <Divider />}
    </Stepper>
  );
}
