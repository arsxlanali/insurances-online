import axios from 'axios';

export const getURLShorten = (genetatedUrl: string) =>
  axios.post(
    'https://api.tinyurl.com/create',
    {
      url: genetatedUrl,
    },
    {
      headers: {
        Authorization: `Bearer KH0exPTgRBnhMtWtW7HrSSDH3y2Apx5mvAATTSOB801wXf7TvCCBXDaKyCZ0`,
      },
    }
  );
