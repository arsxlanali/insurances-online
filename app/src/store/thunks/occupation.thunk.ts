import { createAsyncThunk } from '@reduxjs/toolkit';
import * as OccupationAPI from 'src/api/OccupationAPI';
import { RootState } from '..';

export const insuranceOccupation = createAsyncThunk<
  string[],
  InsuranceOccupationProps,
  { state: RootState }
>('occupation/additional/insurance', async (props, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const person = state.contribution.persons.find(({ Id }) => Id === props.Id);
    if (!person) throw new Error('No person exists');
    const tarrif = person.res
      .flatMap((item) => item.options)
      .filter(({ selected }) => selected)[0] as ContributionOption;
    const res = await OccupationAPI.getInsuranceOccupation(
      state.config.mandant,
      tarrif.insuranceId,
      props.input,
      person.gender.toUpperCase()
    );
    let data: string[] = [];
    if (res.data.success) {
      data = Object.entries<any>(res.data.value)
        .flatMap(([_key, arr]) => arr)
        .map((o) => o.occupation);
    }
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
});
