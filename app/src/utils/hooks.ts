import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import AppConsts from 'src/config/appconst';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useInsuranceRisk = (index: number, riskIdxState?: number) => {
  const person = useAppSelector(
    (state) => state?.contribution.persons[index - 1]
  );
  const selectedInsurences = useAppSelector(
    (state) => state.riskCheck.selectedInsurences
  );
  const [insruance] = selectedInsurences[index - 1].riskCheckOptions.filter(
    (i) => {
      if (i.questionnaire) {
        if (
          selectedInsurences[index - 1].riskCheckOptions.every(
            (e) =>
              e.questionnaire?.riskCheckStatus === AppConsts.orderWaitingSubmit
          )
        ) {
          return true;
        }
        return (
          i.questionnaire?.riskCheckStatus !== AppConsts.orderWaitingSubmit
        );
      }
      return true;
    }
  );
  const options = selectedInsurences[index - 1].riskCheckOptions.map(
    (insurance) => insurance.option
  );
  let riskIdx: number = -1;
  if (riskIdxState && riskIdxState < 0) {
    riskIdx = selectedInsurences[index - 1].riskCheckOptions.findIndex((i) => {
      return insruance.option.id === i.id;
    });
  } else if (riskIdxState) {
    riskIdx = riskIdxState - 1;
  }

  const returnVal: [
    RiskCheckOption[],
    InsuredPerson,
    number,
    ContributionOptionExclusive[]
  ] = [
    selectedInsurences[index - 1].riskCheckOptions,
    person,
    riskIdx,
    options,
  ];
  return returnVal;
};
