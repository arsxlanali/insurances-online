import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Backdrop from '@mui/material/Backdrop';
import NavigationIcon from '@mui/icons-material/Navigation';
import { useAppSelector } from 'src/utils/hooks';
import PersonInfo from 'src/pages/confirmation/PersonInfo';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export default function InfoBox() {
  const contact = useAppSelector((state) => state.config.agentData);

  const queryParams = new URLSearchParams(window.location.search);
  const remarksEncoded = queryParams.get('remarks') || '';
  const remarks = remarksEncoded ? JSON.parse(atob(remarksEncoded)) : '';
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  // Attach the handleOpen function to the window object
  React.useEffect(() => {
    window.handleOpenFab = handleOpen;

    // Cleanup the reference when the component unmounts
    return () => {
      delete window.handleOpenFab;
    };
  }, []);

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: '20%',
          rotate: '90deg',
          left: '4px',
          transform: ' translate(-20%, 35px)',
        }}
      >
        <Fab
          variant="extended"
          size="small"
          color="primary"
          sx={{
            borderRadius: '2px !important',
            paddingRight: '10px',
            zIndex: '11111111111 !important',
            transition: 'transform 0.3s ease-in-out',
            transform: open ? 'translateY(40px)' : 'translateY(0px)',
            '&:hover': {
              transform: 'translateY(-2px)',
            },
          }}
          onClick={handleOpen}
          id="contactBtn"
        >
          <NavigationIcon sx={{ mr: 1 }} />
          Kontakt
        </Fab>
      </Box>
      <Backdrop
        sx={{
          backgroundColor: 'unset',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={open}
        TransitionComponent={Transition}
        onClick={handleClose}
      >
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            left: '40px',
            zIndex: '100000',
            transform: 'translateY(40%)',
          }}
        >
          <PersonInfo contact={contact} remarks={remarks} />
        </Box>
      </Backdrop>
    </>
  );
}
