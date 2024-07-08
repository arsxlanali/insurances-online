import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';
import { getTextColor } from 'src/utils';
import { Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { hexToRgba } from 'src/utils';
import AVATAR from '../../asserts/avatar.png';
import ContactInfoComponent from 'src/components/ContactInfoComponent';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

interface Props {
  contact: AgentData;
  remarks: string;
  title?: string;
}

export default function PersonInfo({ contact, remarks, title }: Props) {
  const queryParams = new URLSearchParams(window.location.search);
  const mandant = queryParams.get('mandant') || '';
  const textColor = getTextColor(mandant);
  const theme = useTheme();
  const secondaryColor = hexToRgba(theme.palette.secondary.main, 1);

  const svgData = encodeURIComponent(`
  <svg width="27" height="19" viewBox="0 0 27 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M27 3.081C22.2676 -0.0262935 14.5982 0.535387 0 0.5C10.5563 6.45509 16.3477 10.2665 19 18.9995C19.0857 19.0747 18.4606 10.79 27 3.081Z" fill="${secondaryColor}"/>
  </svg>
`);

  const svgUrl = `url("data:image/svg+xml,${svgData}")`;
  return (
    <React.Fragment>
      <CssBaseline />
      {title ? (
        <Box>
          <Typography
            variant="h5"
            sx={{ padding: '30px 0 0 20px', color: 'primary.main' }}
          >
            {title}
          </Typography>
          <Container maxWidth="lg" sx={{ marginBottom: '40px' }}>
            <Avatar
              sx={{ width: 40, height: 40, position: 'relative', top: '50px' }}
              src={AVATAR}
              alt="Avatar"
            />
            <Box
              sx={{
                bgcolor: secondaryColor,
                padding: '20px',
                borderRadius: '20px 20px 0 20px',
                marginLeft: '50px',
                position: 'relative',
                ':before': {
                  content: "''",
                  display: 'block',
                  width: '27px',
                  height: '19px',
                  backgroundImage: svgUrl,
                  position: 'absolute',
                  top: '3px',
                  left: '-19px',
                },
              }}
            >
              <ContactInfoComponent
                contact={contact}
                remarks={remarks}
                textColor={textColor}
              />
            </Box>
          </Container>
        </Box>
      ) : (
        <Box
          sx={{
            // background: (theme) => theme.palette.primary.main,
            background: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            padding: '15px 25px',
            borderRadius: '2px',
            boxShadow: '10px 3px 21px 0px rgba(0,0,0,0.75)',
          }}
        >
          <Box>
            <CancelOutlinedIcon sx={{ color: 'black' }} />
          </Box>

          <ContactInfoComponent
            contact={contact}
            remarks={remarks}
            textColor={'black'}
          />
        </Box>
      )}
    </React.Fragment>
  );
}
