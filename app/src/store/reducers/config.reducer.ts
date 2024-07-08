import { createSlice } from '@reduxjs/toolkit';

const initialState: ConfigState = {
  logo: {
    position: '',
    size: '',
  },
  mandant: '',
  agentId: '',
  theme: {},
  customQuestions: [],
  customFields: [],
  customValues: {},
  answeredCustomQuestions: false,

  agentData: {
    agentNumber1: '',
    agentNumber2: '',
    street: '',
    firstName: '',
    lastName: '',
    company: '',
    city: '',
    zipcode: '',
    mobile: '',
    phone: '',
    email: '',
  },
};

const ConfigSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    updateAnsweredCustomQuestions: (state, { payload }) => {
      state.answeredCustomQuestions = payload;
    },
    setConfig: (_, { payload }) => {
      return payload;
    },
  },
});

export const { setConfig, updateAnsweredCustomQuestions } = ConfigSlice.actions;

export const configReducer = ConfigSlice.reducer;
