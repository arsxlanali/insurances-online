import axios from 'axios';

export const sendEmail = (
  agentData: any,
  toEmail: string,
  subject: string,
  mandant: string,
  riskCheckId: string,
  tariffId: string,
  documentsId: string[],
  sendAttachments: boolean,
  template_name: string
) =>
  axios.post(
    `${
      process.env.REACT_APP_BASE_URL
    }/${mandant}/email/send/${riskCheckId}/${tariffId.replaceAll(';', '#')}`,
    {
      data: agentData,
      to: toEmail,
      subject,
      sendAttachments,
      documentsId,
      template_name,
    }
  );
