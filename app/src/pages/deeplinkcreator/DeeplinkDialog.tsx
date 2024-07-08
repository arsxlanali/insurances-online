import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { showSuccess } from 'src/utils/toast';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  url: string
}

export default function DeeplinkDialog({ open, setOpen, url }: Props) {

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    showSuccess('Link kopiert')
    setOpen(false)
  };

  return (
    <Dialog open={open}>
      <DialogTitle id="alert-dialog-title">Generierter Link</DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          fontSize={15}
          sx={{ maxWidth: '500px', overflowWrap: 'break-word' }}
        >
          {url}
        </DialogContentText>

      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={() => setOpen(false)}>
          Abbrechen
        </Button>
        <Button variant="contained" onClick={copyToClipboard}>
          Link kopieren
        </Button>
      </DialogActions>
    </Dialog>
  );
}
