import axios from 'axios';

export const startRiskCheck = (mandant: string, body: RiskCheckBody) =>
  axios.post(
    process.env.REACT_APP_BASE_URL + `/${mandant}/order/startriskcheck/additional`,
    body,
  );

export const checkRiskCheck = (mandant: string, body: RiskCheckBody) =>
  axios.post(
    process.env.REACT_APP_BASE_URL + `/${mandant}/order/checkriskcheck/additional`,
    body,
  );

export const submitOrder = (mandant: string, riskCheckId: string) =>
  axios.post(
    process.env.REACT_APP_BASE_URL + `/${mandant}/order/submitOrder/additional`,
    { riskCheckId },
  );
