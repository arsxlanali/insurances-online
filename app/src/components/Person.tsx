import { useState, forwardRef, useEffect } from 'react';
import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
  Stack,
  Pagination,
  Alert,
  Snackbar,
  Box,
} from '@mui/material';
import TarifInfo from 'src/pages/summary/TarifInfo';
import { useAppDispatch, useAppSelector } from 'src/utils/hooks';
import { AccordionProps } from '@mui/material';
import TooltipReusable from './TooltipReusable';
import { setOrderFalse } from 'src/store/reducers/riskCheck.reducer';
import RiskInfoComponent from './RiskInfoComponent';
import { getTextColor } from 'src/utils';
import { SxProps } from '@mui/system';

interface Props {
  children: JSX.Element | JSX.Element[];
  index: number;
  title: string;
  personRef?: React.MutableRefObject<HTMLDivElement | null>;
  options?: ContributionOptionExclusive[];
  renderNav?: JSX.Element;
  riskIndex?: number;
  defaultExpanded: boolean;
  showCompletedTariffs: boolean;
  benefitExclusion?: BenefitExclusive;
}

function isIndexBeforeFalse(array: boolean[], index: number): boolean {
  if (index < array.length - 1) {
    return array[index] && !array[index + 1];
  }
  return false;
}

const AccordionWithRef = forwardRef<HTMLDivElement, AccordionProps>(
  (props, ref) => <Accordion {...props} ref={ref} />
);

export default function Person({
  children,
  index,
  title,
  personRef,
  options,
  defaultExpanded,
  riskIndex,
  renderNav,
  showCompletedTariffs,
}: Props) {
  const personState = useAppSelector((state) => state.contribution.personState);
  const selectedTariffs = useAppSelector(
    (state) => state.riskCheck.selectedInsurences[index - 1]?.riskCheckOptions
  );
  const { mandant } = useAppSelector((state) => state.config);
  const { orderStatus } = useAppSelector((state) => state.riskCheck);
  const step = useAppSelector((state) => state.stepper.steps);
  const [expand, setExpand] = useState(true);
  const showTooltipFlag = isIndexBeforeFalse(personState, index - 1);
  const [showTooltip, setShowTooltip] = useState(showTooltipFlag);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const refElement = personRef?.current;
    setShowTooltip(showTooltipFlag);

    if (refElement) {
      if (personRef?.current && !defaultExpanded && orderStatus) {
        personRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }

    const timer = setTimeout(() => {
      setShowTooltip(false);
      dispatch(setOrderFalse());
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personRef, personState, riskIndex]);

  const tooltipTitle = (
    <Alert severity="info" sx={{ width: '100%' }}>
      Die Daten zu Person {index} {title} wurden erfolgreich erfasst. Bitte mit
      der nächsten Person fortfahren.
    </Alert>
  );
  const tooltipTitleRisk =
    riskIndex && riskIndex > 1 && selectedTariffs[riskIndex - 2] ? (
      <Alert severity="info" sx={{ width: '100%' }}>
        Die Daten für den Tarif{' '}
        {selectedTariffs[riskIndex - 2].option.displayString} wurden erfolgreich
        erfasst. Bitte mit dem nächsten Tarif fortfahren.
      </Alert>
    ) : (
      <div />
    );
  const disable = !defaultExpanded && personState[index - 1];
  const styles: SxProps<Theme> = {
    '& .MuiPaginationItem-page.Mui-selected': {
      color: (theme: Theme) => {
        if (theme.palette.customInfoIconColor) {
          return theme?.palette?.customInfoIconColor?.textPersonHeader;
        } else {
          return getTextColor(mandant);
        }
      },
      backgroundColor: (theme: Theme) => {
        if (theme.palette.customInfoIconColor) {
          return theme.palette.customInfoIconColor.main;
        } else {
          return theme.palette.secondary.main;
        }
      },
    },
    '& .MuiPaginationItem-page.Mui-selected:hover': {
      backgroundColor: 'transparent',
    },
    '& .MuiPaginationItem-page': {
      color: 'white',
    },
  };

  const renderPerson = () => {
    return (
      <AccordionWithRef
        ref={personRef}
        disabled={disable}
        expanded={defaultExpanded ? expand : !personState[index - 1]}
      >
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: 'white' }} />}
          onClick={() => {
            setExpand(!expand);
          }}
          sx={{
            bgcolor: 'primary.main',
            height: '50px',
            '&.Mui-expanded': {
              minHeight: 'unset',
            },
          }}
        >
          <Grid
            container
            justifyContent={'space-between'}
            sx={!defaultExpanded ? { cursor: 'default' } : {}}
          >
            <Grid item>
              <Typography
                variant="h5"
                sx={{ padding: '4px 0', color: 'white' }}
              >
                Ihre persönlichen Daten {title}
              </Typography>
            </Grid>
            {options &&
              options.length > 1 &&
              riskIndex &&
              !renderNav &&
              !disable && (
                <Grid item>
                  <Grid container alignItems={'center'}>
                    <Grid item>
                      <Stack sx={{ pointerEvents: 'none', color: 'red' }}>
                        <Pagination
                          count={selectedTariffs.length}
                          page={riskIndex}
                          hidePrevButton
                          hideNextButton
                          sx={styles}
                        />
                      </Stack>
                    </Grid>
                    <Grid item>
                      <TooltipReusable
                        isHeader={true}
                        title={[
                          `Sie haben insgesamt ${selectedTariffs.length} Tarife zur Beantragung ausgewählt. Die für den Abschluss dieser Tarife notwendigen Angaben, werden nacheinander abgefragt.`,
                        ]}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}
          </Grid>
        </AccordionSummary>
        {options && options?.length > 1 && renderNav}

        <AccordionDetails>
          {options && options.length > 0 && (
            <>
              <Typography
                variant="h6"
                sx={{ py: 3, pr: 5, fontWeight: 'bold', whiteSpace: 'nowrap' }}
              >
                {step === 3
                  ? options.length > 1
                    ? 'Ihre beantragten Tarife:'
                    : 'Ihr beantragter Tarif:'
                  : options.length > 1
                  ? 'Ihre ausgewählten Tarife:'
                  : 'Ihr ausgewählter Tarif:'}
              </Typography>
              <TarifInfo
                options={options}
                riskIndex={riskIndex}
                index={index - 1}
                showCompletedTariffs={showCompletedTariffs}
              />
            </>
          )}
          {step === 2 && (
            <Alert
              severity="info"
              sx={{ width: '100%', alignItems: 'center', marginY: 3 }}
            >
              <Box>
                <Typography>
                  Mit Klick auf "KOSTENPFLICHTIG BEANTRAGEN" bestätige ich, dass
                  der Antrag inklusive der Angaben zum Gesundheitszustand alle
                  von mir gemachten Angaben enthält und bin damit einverstanden,
                  dass der Antrag elektronisch an das Versicherungsunternehmen
                  weitergeleitet wird.
                </Typography>
              </Box>
            </Alert>
          )}
          {riskIndex && options && (
            <RiskInfoComponent riskIndex={riskIndex} options={options} />
          )}
          {children}
        </AccordionDetails>
      </AccordionWithRef>
    );
  };

  return (
    <>
      {renderPerson()}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={showTooltip ? showTooltip : !defaultExpanded && orderStatus}
      >
        {showTooltip ? tooltipTitle : tooltipTitleRisk}
      </Snackbar>
    </>
  );
}
