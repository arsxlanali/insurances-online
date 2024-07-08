import { createSlice } from '@reduxjs/toolkit';

const initialState: StepperState = {
  steps: 0,
};

const StepperSlice = createSlice({
  name: 'contribution',
  initialState,
  reducers: {
    incrementStep: (state) => {
      state.steps = state.steps + 1;
    },
    decrementStep: (state) => {
      const newStep = state.steps - 1;
      state.steps = newStep >= 0 ? newStep : 0;
    },
  },
});

export const { incrementStep, decrementStep } = StepperSlice.actions;

export const stepperReducer = StepperSlice.reducer;
