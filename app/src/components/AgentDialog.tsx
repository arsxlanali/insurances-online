import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
  } from '@mui/material';

  interface Props {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
  export default function AgentDialog({open, setOpen}: Props) {

    return (
      <Dialog open={open}>
        <DialogTitle id="alert-dialog-title">Hinweis</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" fontSize={15}>
          Diese Vermittlernummer ist noch nicht freigeschaltet. Bitte wenden Sie sich an {''}
          <a href="mailto:support@levelnine.de">support@levelnine.de</a>  {' '}
           um eine Freischaltung zu beantragen.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Bestätigen
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  