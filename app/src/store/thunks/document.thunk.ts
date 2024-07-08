import { createAsyncThunk } from '@reduxjs/toolkit';
import * as DocumentAPI from 'src/api/DocumentAPI';
import { RootState } from '..';
import {
  setDownlaodStart,
  setDownloadEnd,
} from '../reducers/riskCheck.reducer';
import * as SendEmailAPI from 'src/api/SendEmailAPI';
import mandants from 'src/config/mandant';
import { convertCurrencyString, formatNumber } from 'src/utils/numberFormater';

export const getTarrifDocuments = createAsyncThunk<
  DownloadDoc[],
  TariffIdProps,
  { state: RootState }
>('tarrif/additional/document', async (props, thunkAPI) => {
  try {
    thunkAPI.dispatch(setDownlaodStart());
    const state = thunkAPI.getState();
    const res = await DocumentAPI.getTariffsDocuments(
      state.config.mandant,
      encodeURIComponent(props.tariffId)
    );
    thunkAPI.dispatch(setDownloadEnd());
    const documents: DownloadDoc[] = res?.data?.value ?? [];
    return documents;
  } catch (e) {
    console.error(e);
    throw e;
  }
});

export const getRiskCheckDocuments = createAsyncThunk<
  DownloadDoc[],
  RiskCheckIdProps,
  { state: RootState }
>('submit/riskCheck/document', async (props, thunkAPI) => {
  try {
    const { riskCheckData, riskCheckId, tariffId } = props;
    const state = thunkAPI.getState();
    const res = await DocumentAPI.getRiskCehckDocuments(
      state.config.mandant,
      encodeURIComponent(props.riskCheckId)
    );
    const parts = state.contribution.commencementDate.split('-');
    // Rearrange the parts to format as "DD.MM.YYYY"
    const commencementDate = `${parts[2]}.${parts[1]}.${parts[0]}`;

    const agentContact = state.config.agentData;

    type Mandant = keyof typeof mandants;
    const sendAttachments =
      mandants[state.config.mandant as Mandant].sendAttachments;

    if (riskCheckData.price) {
      riskCheckData.formatedPrice = formatNumber(riskCheckData.price);
    }

    if (riskCheckData.differentFee) {
      riskCheckData.additionalFee = formatNumber(
        convertCurrencyString(riskCheckData.differentFee) - riskCheckData.price
      ).concat(' €');

      riskCheckData.formatedPrice = riskCheckData.differentFee.replace('€', '');
    }

    if (state?.config?.agentData?.email) {
      const agentData = {
        ...agentContact,
        commencementDate,
        ...riskCheckData,
      };

      const customTempalteAgent =
        mandants[state.config.mandant as Mandant]?.customTemplate?.agent ??
        (process.env.REACT_APP_EMAIL_TEMPLATE_DEFAULT_AGENT || '');
      SendEmailAPI.sendEmail(
        agentData,
        state?.config?.agentData?.email,
        `Eingangsbestätigung eines Abschlusses für ${riskCheckData.name} mit der Auftragsnummer ${riskCheckData?.applicationNumber}`,
        state.config.mandant,
        riskCheckId,
        tariffId,
        riskCheckData.documentQuestions,
        sendAttachments?.agent,
        customTempalteAgent
      );
    }

    if (riskCheckData?.email) {
      const agentData = {
        ...agentContact,
        commencementDate,
        ...riskCheckData,
      };
      const customTempalteClient =
        mandants[state.config.mandant as Mandant]?.customTemplate?.client ??
        (process.env.REACT_APP_EMAIL_TEMPLATE_DEFAULT_CLIENT || '');
      SendEmailAPI.sendEmail(
        agentData,
        riskCheckData.email,
        `Eingangsbestätigung Ihres Versicherungsantrags ${riskCheckData?.applicationNumber}`,
        state.config.mandant,
        riskCheckId,
        tariffId,
        riskCheckData.documentQuestions,
        sendAttachments?.client,
        customTempalteClient
      );
    }
    const documents: DownloadDoc[] = res?.data?.value.documents ?? [];
    return documents;
  } catch (e) {
    console.error(e);
    throw e;
  }
});
