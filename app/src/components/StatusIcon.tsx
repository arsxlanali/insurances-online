import { CheckRounded, CloseRounded } from '@mui/icons-material';
import { Box } from '@mui/material';

const getStatusIcon = (check: boolean, size: number) => {
  const iconSx = {
    height: Math.ceil(size * 250),
    width: Math.ceil(size * 250),
    borderRadius: '70%',
    border: '20px solid',
    color: check ? 'green' : 'red',
  };
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mt: 2,
      }}
    >
      {check ? <CheckRounded sx={iconSx} /> : <CloseRounded sx={iconSx} />}
    </Box>
  );
};
export default getStatusIcon;
