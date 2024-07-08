import { Grid, Button } from '@mui/material';
import { useAppDispatch } from '../utils/hooks';
import { incrementStep } from '../store/reducers/stepper.reducers';

interface Props {
  disableNext: boolean;
  nextText?: string;
  onNext?: () => void;
}

export default function Footernav({ disableNext, nextText, onNext }: Props) {
  const dispatch = useAppDispatch();
  return (
    <Grid
      container
      justifyContent="flex-end"
      alignItems="center"
      height="100px"
    >
      {!disableNext && (
        <Grid item>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              onNext ? onNext() : dispatch(incrementStep());
            }}
          >
            {nextText ?? 'Weiter'}
          </Button>
        </Grid>
      )}
    </Grid>
  );
}
