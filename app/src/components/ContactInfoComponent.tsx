import React from 'react';
import Typography from '@mui/material/Typography';

interface Props {
  contact: AgentData;
  remarks: string;
  textColor: string;
}

const ContactInfoComponent = ({ contact, remarks, textColor }: Props) => {
  return (
    <div>
      {(contact?.firstName || contact?.lastName) && (
        <Typography
          variant="h6"
          sx={{ padding: '4px 0 20px 0', color: textColor }}
        >
          <span style={{ fontWeight: 'bold' }}>
            {contact?.firstName + ' ' + contact?.lastName}
          </span>
          , Ihr persönlicher Ansprechpartner.
        </Typography>
      )}

      <Typography variant="h6" sx={{ paddingBottom: '20px', color: textColor }}>
        {remarks}
      </Typography>

      {contact?.phone && (
        <Typography variant="h6" sx={{ color: textColor }}>
          <span style={{ fontWeight: 'bold' }}>Festnetznummer:</span>{' '}
          {contact?.phone}
        </Typography>
      )}

      {contact?.mobile && (
        <Typography variant="h6" sx={{ color: textColor }}>
          <span style={{ fontWeight: 'bold' }}>Mobilfunknummer:</span>{' '}
          {contact?.mobile}
        </Typography>
      )}

      {contact?.email && (
        <Typography
          variant="h6"
          sx={{ paddingBottom: '20px', color: textColor }}
        >
          <span style={{ fontWeight: 'bold' }}>Emailadresse:</span>{' '}
          {contact?.email}
        </Typography>
      )}

      {contact?.company && (
        <Typography variant="h6" sx={{ color: textColor }}>
          <span style={{ fontWeight: 'bold' }}>Firma:</span> {contact?.company}
        </Typography>
      )}

      <Typography variant="h6" sx={{ color: textColor }}>
        {contact.street}
      </Typography>

      <Typography variant="h6" sx={{ color: textColor }}>
        {contact.zipcode} {contact.city}
      </Typography>
    </div>
  );
};

export default ContactInfoComponent;
