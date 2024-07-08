import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { setupStore } from './store/index';
import { BrowserRouter } from 'react-router-dom';
import { getQueryParams } from './utils';
import { trackingIdsByMandant } from './config/appconst';
import AppConsts from './config/appconst';
import ReactGA from 'react-ga4';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const defaultMandant = process.env.REACT_APP_MANDANT_DEFAULT as string;
const queryParams = getQueryParams();
const defaultAgentId = AppConsts.agentNumber1;
const defaultAgentId2 = AppConsts.agentNumber2;
const mandant =
  queryParams.get('mandant') !== ''
    ? queryParams.get('mandant') ?? defaultMandant
    : defaultMandant;
type MandantKey = keyof typeof trackingIdsByMandant;
if (Object.keys(trackingIdsByMandant).includes(mandant)) {
  if (process.env.REACT_APP_ENV === 'production') {
    ReactGA.initialize(trackingIdsByMandant[mandant as MandantKey]);
  }
}
const agentId = queryParams.get('agentId1') ?? defaultAgentId;
const agentId2 = queryParams.get('agentId2') ?? defaultAgentId2;
if (process.env.REACT_APP_ENV === 'production') {
  ReactGA.event({
    category: 'events',
    action: `B:${agentId} - ${agentId2}`,
  });
}

const store = setupStore({});
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
