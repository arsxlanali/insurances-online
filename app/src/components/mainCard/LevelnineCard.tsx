import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import InsuranceStep from '../InsuranceStep';
import { Divider, Link } from '@mui/material';

const LevelnineCard: React.FC = () => {
  return (
    <Card
      sx={{
        position: 'relative',
        zIndex: (theme) => theme.zIndex.modal - 1,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'none',
        marginY: '10px',
      }}
    >
      <CardMedia
        component="img"
        alt="Square Image"
        sx={{ maxHeight: 100, borderRadius: '10px' }}
        image="https://images.pexels.com/photos/7792761/pexels-photo-7792761.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      <InsuranceStep />
      <Divider />

      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginY: '20px',
          padding: 'unset',
        }}
      >
        <Typography variant="h5" gutterBottom marginBottom={'20px'}>
          Daten ergänzen
        </Typography>
        <Typography
          variant="body1"
          paragraph
          marginRight={{ sm: '20px', lg: '30px' }}
        >
          Wir benötigen noch ein paar Daten von Ihnen! Nehmen Sie sich für den
          Abschluss folgender Versicherung circa 10-15 Minuten Zeit. Je nach
          Antrag benötigen wir unterschiedliche Daten von Ihnen. Bei Fragen
          wenden Sie sich an ihren Vermittler.{' '}
          <Link
            // variant="contained"
            color="primary"
            href="https://www.levelnine.de/abschlusslinks"
            target="_blank"
            sx={{ fontWeight: 'bold' }}
          >
            Mehr Erfahren
          </Link>
        </Typography>
      </CardContent>
      <Divider />
    </Card>
  );
};

export default LevelnineCard;
