import axios from 'axios';

export const getInsuranceOccupation = (
  mandant: string,
  insuranceId: string,
  searchText: string,
  gender: string
) =>
  axios.get(
    process.env.REACT_APP_BASE_URL +
      `/${mandant}/occupation/additional/insurance/${insuranceId}/search?fulltext=${searchText}&gender=${gender}`,
  );
