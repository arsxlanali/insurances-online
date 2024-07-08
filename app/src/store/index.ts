import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
  PreloadedState,
} from '@reduxjs/toolkit';
import { contributionReducer } from './reducers/contribution.reducer';
import { stepperReducer } from './reducers/stepper.reducers';
import { riskCheckReducer } from './reducers/riskCheck.reducer';
import { configReducer } from './reducers/config.reducer';
import { deeplinkReducer } from './reducers/deeplink.reducer';

export const rootReducer = combineReducers({
  contribution: contributionReducer,
  stepper: stepperReducer,
  riskCheck: riskCheckReducer,
  config: configReducer,
  deeplink: deeplinkReducer,
});

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
