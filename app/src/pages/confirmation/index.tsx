import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import EmailModal from 'src/components/EmailDialog';
import getStatusIcon from 'src/components/StatusIcon';
import AppConsts from 'src/config/appconst';
import { useAppSelector } from '../../utils/hooks';
import OrderStatus from './OrderStatus';
import PersonInfo from './PersonInfo';

export default function Confirmation() {
  const { persons } = useAppSelector((state) => state?.contribution);
  const contact = useAppSelector((state) => state.config.agentData);
  const queryParams = new URLSearchParams(window.location.search);
  const remarksEncoded = queryParams.get('remarks') || '';
  const remarks = remarksEncoded ? JSON.parse(atob(remarksEncoded)) : '';

  let allFulfiled: boolean = false;
  let allRejected: boolean = false;
  const [openEmail, setOpenEmail] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // New state to track component mount status
  const [loader, setLoader] = useState(false);
  let noEmail = false;

  const emailObject: any = [];

  const insuraces = useAppSelector(
    (state) => state.riskCheck.selectedInsurences
  );

  Object.keys(insuraces).forEach((key) => {
    allFulfiled = insuraces[key].riskCheckOptions.every(
      (person) =>
        person?.questionnaire?.riskCheckStatus === AppConsts.orderAccepted
    );
    allRejected = insuraces[key].riskCheckOptions.every(
      (person) =>
        person?.questionnaire?.riskCheckStatus !== AppConsts.orderAccepted
    );
    if (!insuraces[key].previousQuestionaire?.eMail) {
      noEmail = true;
      emailObject.push({
        key: key,
        value: `${insuraces[key].previousQuestionaire.firstName} ${insuraces[key].previousQuestionaire.lastName}`,
      });
    }
  });

  useEffect(() => {
    if (!emailObject.length && !loader) {
      setOpenEmail(false);
    }
  }, [emailObject.length, loader]);

  useEffect(() => {
    setIsMounted(true);
    window.scrollTo(0, 0);
    setTimeout(() => {
      if (isMounted && noEmail) {
        setOpenEmail(true);
      }
    }, 3000);
    return () => {
      setIsMounted(false);
    };
  }, [isMounted, noEmail]);

  return (
    <>
      <EmailModal
        open={openEmail}
        setOpen={setOpenEmail}
        dropdownOptions={emailObject}
        dropdownFlag={emailObject.length > 1}
        loader={loader}
        setLoader={setLoader}
      />
      {allFulfiled && (
        <Box sx={{ marginBottom: 2 }}>
          {getStatusIcon(true, 0.75)}
          <Typography sx={{ fontSize: 16, pt: 2, textAlign: 'center' }}>
            Vielen Dank für das Vertrauen
            <br />
            Der Antrag ist erfolgreich beim Versicherer eingegangen.
            <br />
          </Typography>
        </Box>
      )}
      {allRejected && (
        <Box sx={{ marginBottom: 2 }}>
          {getStatusIcon(false, 0.75)}
          <Typography sx={{ fontSize: 16, pt: 2, textAlign: 'center' }}>
            Beim Abschluss des Vertrages ist es zu einem Fehler gekommen
            <br />
            Bitte die Angaben überprüfen und erneut versenden.
          </Typography>
        </Box>
      )}
      <Box>
        {persons.map((_, index) => (
          <OrderStatus
            index={index + 1}
            key={`${index}person`}
            statusFlag={allFulfiled || allRejected}
          />
        ))}
      </Box>
      <PersonInfo
        contact={contact}
        remarks={remarks}
        title={'Für Rückfragen bitte kontaktieren:'}
      />
    </>
  );
}
