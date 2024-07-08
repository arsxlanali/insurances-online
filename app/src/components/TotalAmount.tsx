import { Typography, Box, Button } from '@mui/material';
import { useAppDispatch } from '../utils/hooks';
import { incrementStep } from '../store/reducers/stepper.reducers';
import { formatNumber } from 'src/utils/numberFormater';

interface Props {
  totalAmount: number;
  disable: boolean;
  hide: boolean;
  text: string;
}
export default function TotalAmount({
  totalAmount,
  disable,
  text,
  hide,
}: Props) {
  const dispatch = useAppDispatch();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexDirection: 'column',
        marginY: '20px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h5">{text}:</Typography>
        <Typography variant="h5">
          {formatNumber(totalAmount)} EUR / Monat
        </Typography>
        <Button
          variant="contained"
          size="large"
          disabled={disable}
          sx={hide ? { display: 'none', width: '200px' } : { width: '200px' }}
          onClick={() => {
            dispatch(incrementStep());
          }}
        >
          Jetzt abschließen
        </Button>
      </Box>
    </Box>
  );
}
