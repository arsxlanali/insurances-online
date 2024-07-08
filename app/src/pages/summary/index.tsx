import { Box } from '@mui/material';
import { useAppSelector } from '../../utils/hooks';
import Footernav from 'src/components/Footernav';
import PersonSummary from './PersonSummary';
import { useEffect, useState } from 'react';
import OrderDialog from './OrderDialog';

export default function InsuranceSummary() {
  const { persons } = useAppSelector((state) => state?.contribution);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box>
      <OrderDialog open={open} setOpen={setOpen} />
      {persons.map((_, index) => (
        <PersonSummary key={index} index={index + 1} />
      ))}
      <Footernav
        disableNext={false}
        nextText={'Kostenpflichtig beantragen'}
        onNext={() => {
          setOpen(true);
        }}
      />
    </Box>
  );
}
