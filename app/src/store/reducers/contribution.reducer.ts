import { createSlice } from '@reduxjs/toolkit';
import {
  calculateTariffsAdditional,
  getTariffsRating,
} from '../thunks/contribution.thunk';
import { uid } from 'uid';

export const initialState: ContributionState = {
  error: '',
  pending: false,
  isTariffClicked: false,
  commencementDate: '',
  personCount: 1,
  totalAmount: 0,
  personsId: [uid(16)],
  personState: [false],
  amount: 0,
  persons: [],
};

const contributionSlice = createSlice({
  name: 'contribution',
  initialState,
  reducers: {
    decrementByAmount: (state) => {
      const newTotal = state.totalAmount - state.amount;
      state.totalAmount = newTotal >= 0 ? newTotal : 0;
      state.amount = newTotal >= 0 ? newTotal : 0;
    },
    dateCommencement: (state, action) => {
      state.commencementDate = action.payload;
    },
    persondecrement: (state, { payload }) => {
      state.personCount = state.personCount - 1;
      state.persons = state.persons.filter(
        (obj) => obj.Id !== state.personsId[payload - 1]
      );
      state.personState.pop();
      state.personsId.splice(payload - 1, 1);
    },
    personIncrement: (state, action) => {
      state.personCount = state.personCount + 1;
      state.personsId = [...state.personsId, action.payload];
      state.personState.push(true);
    },
    personAmount: (state, action) => {
      state.amount = action.payload;
    },
    changePersonState: (state) => {
      const trueIndex = state.personState.findIndex((value) => value === false);
      const nextIndex = (trueIndex + 1) % state.personState.length;
      state.personState[trueIndex] = true;
      state.personState[nextIndex] = false;
    },
    selectOption: (state, action) => {
      const { personIdx, resIdx, optionIdx, amount } = action.payload;
      state.totalAmount += amount;
      state.persons[personIdx].total += amount;
      state.persons[personIdx].res[resIdx].total += amount;
      state.persons[personIdx].res[resIdx].options[optionIdx].selected = true;
    },
    unselectOption: (state, action) => {
      const { personIdx, resIdx, optionIdx, amount } = action.payload;
      state.totalAmount -= amount;
      state.persons[personIdx].total -= amount;
      state.persons[personIdx].res[resIdx].total -= amount;
      state.persons[personIdx].res[resIdx].options[optionIdx].selected = false;
    },
    saveTitle: (state, action) => {
      const { personId, title, firstName, lastName } = action.payload;
      const person = state.persons.find((p) => p.Id === personId);
      if (person) {
        person.title = title;
        person.firstName = firstName;
        person.lastName = lastName;
      }
    },
    setIsTariffClicked: (state) => {
      state.isTariffClicked = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      calculateTariffsAdditional.fulfilled,
      (state, { payload }) => {
        state.error = '';
        state.pending = false;
        const index = state.persons.findIndex(
          (obj) => obj.Id === payload[0].Id
        );

        if (index > -1) {
          const res = [
            ...state.persons.slice(0, index),
            ...payload,
            ...state.persons.slice(index + 1),
          ];
          state.persons = res;
        } else {
          state.persons.push(...payload);
        }
      }
    );
    builder.addCase(calculateTariffsAdditional.rejected, (state, action) => {
      state.error = action.error.message;
      state.pending = false;
    });
    builder.addCase(calculateTariffsAdditional.pending, (state, action) => {
      state.error = '';
      state.pending = true;
    });
    builder.addCase(getTariffsRating.fulfilled, (state, { payload, meta }) => {
      state.persons[meta.arg.personIdx].ratings[meta.arg.tarrifId] = payload;
      state.persons[meta.arg.personIdx].loading = false;
    });
    builder.addCase(getTariffsRating.pending, (state, { meta }) => {
      state.persons[meta.arg.personIdx].loading = true;
    });
    builder.addCase(getTariffsRating.rejected, (state, { meta }) => {
      state.persons[meta.arg.personIdx].loading = false;
    });
  },
});

export const {
  dateCommencement,
  changePersonState,
  persondecrement,
  personIncrement,
  personAmount,
  decrementByAmount,
  selectOption,
  unselectOption,
  saveTitle,
  setIsTariffClicked,
} = contributionSlice.actions;

export const contributionReducer = contributionSlice.reducer;
