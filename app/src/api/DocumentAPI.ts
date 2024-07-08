import axios from 'axios';

export const getTariffsDocuments = (
  mandant: string,
  tariffId: string
) =>
  axios.get(
    process.env.REACT_APP_BASE_URL +
    `/${mandant}/calculate/tariffs/additional/${tariffId}/documents`,
  );

  export const getRiskCehckDocuments = (
    mandant: string,
    riskCheckId: string
  ) =>
    axios.get(
      process.env.REACT_APP_BASE_URL +
      `/${mandant}/order/eventData/${riskCheckId}`,
    );