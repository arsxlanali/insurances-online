import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';

interface Props {
  leftText1: string;
  leftText2: string;
  companyText: string;
}

const Footer = ({ leftText1, leftText2, companyText }: Props) => {
  return (
    <Box
      sx={{
        background: (theme) => theme.palette.primary.main,
        position: 'fixed',
        bottom: '0',
        width: '100%',
        padding: '10px 30px',
        color: '#fff',
      }}
    >
      <Grid
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexDirection={{
          xs: 'column',
          md: 'row',
        }}
      >
        <Grid>
          <div>
            <Link
              href={leftText1}
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              underline="hover"
            >
              Impressum
            </Link>
            {' | '}
            <Link
              href={leftText2}
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              underline="hover"
            >
              Datenschutzhinweise
            </Link>
          </div>
        </Grid>
        <Grid>
          <div>
            <Typography align="left">{companyText}</Typography>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
