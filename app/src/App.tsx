import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import {
  Box,
  Collapse,
  Container,
  CssBaseline,
  Divider,
  Fab,
  ThemeProvider,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import ReactGA from 'react-ga4';
import { Route, Routes } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import './App.css';
import AgentDialog from './components/AgentDialog';
import Footer from './components/Footer';
import { HomeIcon } from './components/HomeIcon';
import InfoBox from './components/InfoBox';
import InsuranceStep from './components/InsuranceStep';
import NoticeDialog from './components/NoticeDialog';
import ScrollTop from './components/ScrollToTop';
import AppConsts from './config/appconst';
import allMandants from './config/mandant';
import mandantCards from './config/mandantCrads';
import mandantTheme from './config/mandantTheme';
import { getTheme } from './config/theme';
import Confirmation from './pages/confirmation';
import Contribution from './pages/contribution';
import DeeplinkCreator from './pages/deeplinkcreator/DeeplinkCreator';
import Insuredperson from './pages/insuredperson';
import InsuranceSummary from './pages/summary';
import { setConfig } from './store/reducers/config.reducer';
import { base64ToUtf8, getQueryParams } from './utils';
import { useAppDispatch, useAppSelector } from './utils/hooks';
import customQuestions from '../src/config/customQuestions.json';
import customFields from 'src/config/customFields.json';
import { availableMandants } from './utils/constants';

const defaultMandant = process.env.REACT_APP_MANDANT_DEFAULT as string;
const defaultAgentId = AppConsts.agentNumber1;
const defaultAgentId2 = AppConsts.agentNumber2;

const queryParams = getQueryParams();

type ComponentKey = 0 | 1 | 2 | 3;
const getComponent: Record<ComponentKey, React.ReactNode> = {
  0: <Contribution />,
  1: <Insuredperson />,
  2: <InsuranceSummary />,
  3: <Confirmation />,
};

function App() {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(true);

  const { steps } = useAppSelector((state) => state.stepper);
  const mandant = queryParams.get('mandant') ?? defaultMandant;
  const agentId = queryParams.get('agentId1') ?? defaultAgentId;
  const agentId2 = queryParams.get('agentId2') ?? defaultAgentId2;

  const contactInformation = queryParams.get('contactInformation');
  const customValuesInformation = queryParams.get('customValues');

  const dispatch = useAppDispatch();
  const theme = useAppSelector(
    (state: { config: { theme: Theme } }) => state.config.theme
  );
  const { isTariffClicked } = useAppSelector((state) => state.contribution);

  type MandantKey = keyof typeof allMandants;
  const mandants = useMemo(() => {
    const activatedMandants =
      process.env.REACT_APP_ACTIVATED_MANDANTS?.split(',');
    const filteredMandants: { [key: string]: any } = {};

    activatedMandants?.forEach((key) => {
      if (allMandants.hasOwnProperty(key)) {
        filteredMandants[key] = allMandants[key as MandantKey];
      }
    });

    return filteredMandants;
  }, []);

  const agentNumbers: string[] =
    mandants[mandant as MandantKey]?.allowedAgentNumbers;

  const allowAgentInfoBox = mandants[mandant as MandantKey]?.allowAgentInfoBox;
  const footer = mandants[mandant as MandantKey]?.footer;

  const agentData = contactInformation
    ? JSON.parse(base64ToUtf8(contactInformation))
    : {};

  const customValues = customValuesInformation
    ? JSON.parse(base64ToUtf8(customValuesInformation))
    : {};

  const isValidMandant = (value: any): value is Mandant => {
    return availableMandants.includes(value);
  };

  useEffect(() => {
    let key = mandants?.hasOwnProperty(mandant) ? mandant : defaultMandant;
    type MandantKeyFiltred = keyof typeof mandants;
    let conf = mandants?.[key as MandantKeyFiltred];
    const themeMandant = mandantTheme[key as MandantKeyFiltred];

    if (
      agentNumbers &&
      agentNumbers.length > 0 &&
      !agentNumbers.includes(agentId) &&
      !agentNumbers.includes(agentId2)
    ) {
      setOpen(true);
    }

    const agentIDs =
      agentId2 !== ''
        ? { agentNumber1: agentId, agentNumber2: agentId2 }
        : { agentNumber1: agentId };

    dispatch(
      setConfig({
        ...conf,
        theme: themeMandant,
        mandant: key,
        agentId,

        customQuestions: isValidMandant(key) ? customQuestions[key] : [],
        customFields: isValidMandant(key) ? customFields[key] : [],
        customValues,
        agentData: {
          ...agentIDs,
          ...agentData,
        },
      } as ConfigState)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mandant, agentId, agentId2, dispatch, agentData]);

  useEffect(() => {
    if (process.env.REACT_APP_ENV === 'production') {
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }, []);

  type MandantCards = keyof typeof mandantCards;
  const infoBoxOnStartpage: string | null =
    mandants[mandant as MandantKey]?.infoBoxOnStartpage;
  const InfoBoxComponent =
    infoBoxOnStartpage !== null
      ? mandantCards[infoBoxOnStartpage as MandantCards]
      : null;

  // const handleBackdropClick = () => {
  //   // Handle backdrop click logic here
  //   setShowBackdrop(false);
  // };

  return (
    <ThemeProvider theme={getTheme(theme)}>
      <ToastContainer transition={Slide} />
      {/* {showBackdrop && (
        <Box
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            transition: 'opacity 0.5s ease',
            opacity: 1,
          }}
          onClick={handleBackdropClick}
        />
      )} */}
      <Routes>
        <Route
          path="/"
          element={
            <Box>
              <CssBaseline />
              {process.env.REACT_APP_ENV !== 'production' && (
                <NoticeDialog open={openDialog} setOpen={setOpenDialog} />
              )}
              {process.env.REACT_APP_ENV !== 'production'
                ? open &&
                  !openDialog && <AgentDialog open={open} setOpen={setOpen} />
                : open && <AgentDialog open={open} setOpen={setOpen} />}
              <div id="back-to-top-anchor"></div>
              <Container sx={{ paddingBottom: '80px' }}>
                <HomeIcon />

                {InfoBoxComponent !== null ? (
                  <Box>
                    <Box
                      sx={{
                        '& > :not(style)': {
                          display: 'flex',
                          justifyContent: 'space-around',
                        },
                      }}
                    >
                      <div>
                        <Collapse
                          in={!isTariffClicked}
                          orientation={'vertical'}
                          easing={'timeout'}
                        >
                          {InfoBoxComponent}
                        </Collapse>
                      </div>
                    </Box>
                    {isTariffClicked && (
                      <>
                        <InsuranceStep />
                        <Divider />
                      </>
                    )}
                  </Box>
                ) : (
                  <>
                    <InsuranceStep />
                    <Divider />
                  </>
                )}
                <Box sx={{ pb: 10 }}>{getComponent[steps as ComponentKey]}</Box>
              </Container>
              {allowAgentInfoBox && steps !== 3 && <InfoBox />}
              <ScrollTop>
                <Fab
                  color="primary"
                  size="small"
                  aria-label="scroll back to top"
                >
                  <ArrowUpwardIcon />
                </Fab>
              </ScrollTop>
            </Box>
          }
        />
        <Route path="/deeplink" element={<DeeplinkCreator />} />
      </Routes>
      <Footer
        leftText1={footer?.imprint}
        leftText2={footer?.dataprotection}
        companyText={footer?.companyText}
      />
    </ThemeProvider>
  );
}

export default App;
