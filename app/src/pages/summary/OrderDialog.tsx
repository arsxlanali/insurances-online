import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { useEffect } from 'react';
import { submitOrder } from 'src/store/thunks/order.thunk';
import { useAppDispatch, useAppSelector } from 'src/utils/hooks';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function OrderDialog({ open, setOpen }: Props) {
  const loading =
    useAppSelector((state) => state.riskCheck.order) === 'pending';
  const close =
    useAppSelector((state) => state.riskCheck.order) === 'fulfilled';
  useEffect(() => {
    if (close) setOpen(false);
  }, [close, setOpen]);
  const dispatch = useAppDispatch();
  return (
    <Dialog open={open}>
      <DialogTitle id="alert-dialog-title">Hinweis</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" fontSize={15}>
          Hiermit bestätige ich, dass alle gemachten Angaben korrekt und
          vollständig sind. Mir ist bewusst, dass durch einen Klick auf
          "Kostenpflichtig Beantragen" ein verbindlicher Antrag beim Versicherer
          eingereicht wird.
        </DialogContentText>
        {loading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100px',
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button onClick={() => dispatch(submitOrder())} disabled={loading} variant="contained">
          Kostenpflichtig Beantragen
        </Button>
        <Button onClick={() => setOpen(false)} disabled={loading} variant="outlined">
          Beantragung abbrechen
        </Button>
      </DialogActions>
    </Dialog>
  );
}
