import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  extractCalculateTarrifType,
} from '../../api/Requests';
import axios from 'axios';
import { RootState } from '..';

export const getInsurer = createAsyncThunk(
  'deeplink/insurances/additional',
  async (_, thunkAPI: any) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const insuraceType = await axios.get(
        process.env.REACT_APP_BASE_URL +
          `/${state.config.mandant}/calculate/insurances/additional`
      );
      if (insuraceType?.data?.value) {
        return insuraceType?.data?.value.map((insurer: any) => {
          return { id: insurer.insuranceId, value: insurer.insuranceName };
        });
      }
      return insuraceType?.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const getTariffs = createAsyncThunk(
  'deeplink/tariffs/additional',
  async ({ insurer, tarifftypes }: any, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const obje = extractCalculateTarrifType(
        tarifftypes ? tarifftypes : process.env.REACT_APP_TARIFFTYPES || ''
      );
      const promises = obje.map((obj) =>
        axios.post(
          process.env.REACT_APP_BASE_URL +
            `/${state.config.mandant}/calculate/tariffs/additional`,
          {
            responseDescription: 'true',
            startDate: '2023-08-01',
            customer: {
              birthday: '1980-06-02',
              gender: 'MALE',
              maritalStatus: '1',
              occupationGroup: '1',
            },
            additional: obj,
          }
        )
      );
      const response = await Promise.all(promises);
      let resObj: any = []; 
      response.forEach((res: any) => {
         resObj.push(...res.data.value)
      });
      resObj = resObj.filter((item: any)=> {
        return insurer.includes(item.insuranceId)
      })
      const finalResponse = resObj.map((item: any)=>{
        return {
            id: item.id,
            value: item.displayString,
        }
      })
      return finalResponse;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);
