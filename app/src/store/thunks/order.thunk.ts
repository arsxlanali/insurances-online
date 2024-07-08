import { createAsyncThunk } from '@reduxjs/toolkit';
import * as OrderAPI from 'src/api/OrderAPI';
import { RootState } from '..';
import { showError } from 'src/utils/toast';
import { getQuestionaire } from './riskCheck.thunk';
import { getErrorMessage } from 'src/utils';
import { incrementStep } from '../reducers/stepper.reducers';
import { getRiskCheckDocuments } from './document.thunk';

import ReactGA from 'react-ga4';

export const submitOrder = createAsyncThunk<
  (Questionnaire | null)[],
  void,
  { state: RootState }
>('order/submitOrder/additional', async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as RootState;
    const riskCheckIds: string[] = [];
    const eventData: { [key: string]: SubmitEventData } = {};
    const riskCheckDataObject: { [key: string]: RiskCheckData } = {};
    const selectedInsurences = state.riskCheck.selectedInsurences;
    Object.keys(selectedInsurences).forEach((key) => {
      selectedInsurences[key].riskCheckOptions.forEach(
        (insurace: RiskCheckOption) => {
          const { questionnaire } = insurace;
          const riskCheckId = questionnaire?.riskCheckId;
          if (riskCheckId) {
            riskCheckIds.push(riskCheckId);
            const { eMail, firstName, lastName } =
              selectedInsurences[key].previousQuestionaire;

            const documentQuestions: string[] = [];
            insurace?.questionnaire?.questionaryValues.forEach((q) => {
              if (q.key.match(/downloadLnDocument_(\d+)/)) {
                documentQuestions.push(
                  q.key.substring(q.key.lastIndexOf('_') + 1)
                );
              }
            });
            riskCheckDataObject[riskCheckId] = {
              riskCheckId,
              email: eMail,
              name: `${firstName} ${lastName}`,
              tariff: insurace.option.displayString,
              tariffId: insurace.option.tarrifId,
              price: insurace.option.fee,
              insranceName: insurace.option?.insuranceName,
              benefitExclusion: insurace.option?.orderAcceptedBenefitExclusion,
              additionalFee: insurace.option?.orderAcceptedAdditionalFee,
              additionalFeeReason:
                insurace.option?.orderAcceptedAdditionalFeeReason,
              differentFee: insurace.option?.orderAcceptedDifferentFee,
              documentQuestions,
            };
            eventData[riskCheckId] = {
              tariffDisplayString: insurace?.option?.displayString,
              insurer: insurace?.option?.symbol,
            };
          }
        }
      );
    });
    const orders = await Promise.allSettled(
      riskCheckIds.map((id) => OrderAPI.submitOrder(state.config.mandant, id))
    );
    const questionaires = orders.map((order) => {
      try {
        if (order.status === 'fulfilled') {
          const riskCheckId = order?.value?.data?.value?.riskCheckId;
          if (process.env.REACT_APP_ENV === 'production') {
            const agentData = state.config.agentData;
            ReactGA.event({
              category: 'events',
              action: `SO: ${eventData[riskCheckId]?.insurer}-${eventData[riskCheckId]?.tariffDisplayString}`,
            });
            ReactGA.event({
              category: 'events',
              action: `SO: ${agentData?.agentNumber1}-${agentData?.agentNumber2 ?? ''}`,
            });
          }

          riskCheckDataObject[riskCheckId] = {
            ...riskCheckDataObject[riskCheckId],
            applicationNumber: order?.value?.data?.value?.referenceId,
          };
          const riskCheckData = riskCheckDataObject[riskCheckId];
          const tariffId = riskCheckData.tariffId;

          thunkAPI.dispatch(
            getRiskCheckDocuments({ riskCheckId, tariffId, riskCheckData })
          );
          const res = order.value;
          return getQuestionaire(res);
        } else {
          // const riskCheckId = order?.reason?.value?.data?.value?.riskCheckId;
          // ReactGA.event({
          //   category: 'events',
          //   action: `Failed setOrder: ${eventData[riskCheckId]?.symbol}, ${eventData[riskCheckId]?.tariffDisplayString}, ${eventData[riskCheckId]?.agentNumber1}, ${eventData[riskCheckId]?.agentNumber2} `,
          // });
          showError(order.reason);
        }
      } catch (error) {
        showError(getErrorMessage(error));
      }
      return null;
    });

    if (process.env.REACT_APP_ENV === 'production') {
      ReactGA.event({
        category: 'events',
        action: 'Submit Success',
      });
    }

    thunkAPI.dispatch(incrementStep());
    return questionaires;
  } catch (e) {
    console.error(e);
    if (process.env.REACT_APP_ENV === 'production') {
      ReactGA.event({
        category: 'events',
        action: 'Submit Error',
      });
    }
    throw e;
  }
});
