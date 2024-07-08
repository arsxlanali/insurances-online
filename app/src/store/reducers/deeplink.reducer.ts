import { createSlice } from '@reduxjs/toolkit';
import { getInsurer, getTariffs } from '../thunks/deeplink.thunk';

export const initialState: DeeplinState = {
  insurers: [{id: 0, value: ''}],
  tariffs: [{id: '', value: ''}],
};

const deeplinkSlice = createSlice({
  name: 'deeplink',
  initialState,
  reducers: {
    setDeeplink: (_, { payload }) => {
        return payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getInsurer.fulfilled, (state, { payload }) => {
        state.insurers = payload
    });
    builder.addCase(getTariffs.fulfilled, (state, { payload }) => {
        state.tariffs = payload
    });
  },
});

export const { setDeeplink } = deeplinkSlice.actions;

export const deeplinkReducer = deeplinkSlice.reducer;
