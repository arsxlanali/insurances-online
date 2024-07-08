import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  extractData,
  extractCalculateTarrifType,
  extractCalculateTarrifHeading,
  getHeadingsByTypes,
  createTariffObject,
} from '../../api/Requests';
import axios from 'axios';
import { RootState } from '..';
import allMandants from '../../config/mandant';

export const calculateTariffsAdditional = createAsyncThunk(
  'calculate/tariffs/additional',
  async (props: any, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const queryParams = new URLSearchParams(window.location.search);
      const tariffs = queryParams.get('tariffs') || '';
      const tariffsArray = tariffs.replace(/@/g, '#').split(',');
      const insurers = queryParams.get('insurers') || '';
      const insurersArray = insurers.split(',');
      const tarifftypes = queryParams.get('tarifftypes') || '';
      const tariffArray = tarifftypes.split(',');
      const obje = extractCalculateTarrifType(
        tarifftypes ? tarifftypes : process.env.REACT_APP_TARIFFTYPES || ''
      );
      const promises = obje.map((obj) =>
        axios.post(
          process.env.REACT_APP_BASE_URL +
            `/${state.config.mandant}/calculate/tariffs/additional`,
          {
            ...props.data,
            additional: obj,
          }
        )
      );
      const response = await Promise.all(promises);
      const insuraceType = await axios.get(
        process.env.REACT_APP_BASE_URL +
          `/${state.config.mandant}/calculate/insurances/additional`
      );

      const tariftypes = createTariffObject(
        process.env.REACT_APP_TARIFFTYPES_HEADING || '',
        process.env.REACT_APP_TARIFFTYPES || ''
      );

      const heading = getHeadingsByTypes(tariffArray);
      const responseFinal = extractCalculateTarrifHeading(
        heading ? heading : process.env.REACT_APP_TARIFFTYPES_HEADING || ''
      );
      const ratings: any = {};
      const defaultMandant = process.env.REACT_APP_MANDANT_DEFAULT as string;
      const mandant = queryParams.get('mandant') ?? defaultMandant;
      const minPrice = allMandants[mandant]?.minPrice;

      responseFinal.forEach((res, index) => {
        res.options = extractData(
          response[index],
          insuraceType?.data?.value,
          tariffsArray,
          insurersArray,
          tariftypes[res.title]
        );
        res.options.forEach((option) => {
          ratings[option.tarrifId] = null;
        });

        if (minPrice !== null) {
          res.options = res.options.filter((option) => option.fee > minPrice);
        }
      });

      const resObj = [
        {
          Id: props.Id,
          total: 0,
          birthdate: props?.data.customer?.birthday,
          gender: props?.data?.customer?.gender,
          res: responseFinal,
          ratings,
        } as InsuredPerson,
      ];
      return resObj;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const getTariffsRating = createAsyncThunk<
  any,
  { mandant: string; tarrifId: string; personIdx: number },
  { state: RootState }
>('get/tariffs/ratings', async (props) => {
  try {
    const { mandant, tarrifId } = props;
    const response = await axios.get(
      process.env.REACT_APP_BASE_URL +
        `/${mandant}/optimize/tariff/additional/${tarrifId}`
    );

    return response?.data?.value?.templateOnlineQuestions;
  } catch (e) {
    console.error(e);
    throw e;
  }
});
