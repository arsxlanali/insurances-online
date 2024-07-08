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

export default function NoticeDialog({open, setOpen}: Props) {
  return (
    <Dialog open={open}>
      <DialogTitle id="alert-dialog-title">Hinweis</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" fontSize={15}>
          Es handelt sich bei dieser Webseite um einen Showcase der ObjectiveIT
          GmbH. Bitte bestätigen Sie, dass Sie keine reelle Beratung oder
          Vergleich durchführen. Diese Anwendung ist ebenfalls nicht geeignet,
          um Abschlüsse zu tätigen.
          <br />
          <br />
          Bitte wenden Sie sich an{' '}
          <a href="mailto:support@levelnine.de">support@levelnine.de</a> falls
          Sie Fragen zur Anwendung haben.
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
