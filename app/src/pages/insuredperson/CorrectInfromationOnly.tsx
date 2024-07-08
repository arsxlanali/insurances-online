import { Grid, Typography, Link } from '@mui/material';
import { useState } from 'react';
import NoticeDialogContract from 'src/components/NoticeDialogContract';
import mandants from 'src/config/mandant';
import { useAppSelector } from 'src/utils/hooks';

export default function CorrectInformationOnly() {
  const [open, setOpen] = useState(false);
  const { mandant } = useAppSelector((state) => state.config);
  type MandantKey = keyof typeof mandants;
  const { dataprotection } = mandants[mandant as MandantKey]?.footer;
  return (
    <>
      <NoticeDialogContract open={open} setOpen={setOpen} />
      <Grid>
        <Typography variant="body1">
          Ich bestätige, die{' '}
          <Link href={dataprotection} target="_blank" underline="hover">
            Datenschutzerklärung
          </Link>{' '}
          gelesen zu haben und erkläre mich damit einverstanden. Mir ist
          bewusst, dass der Versicherer bei unzureichenden Angaben vom Vertrag
          zurücktreten bzw. die Leistungen verweigern kann (bitte beachten Sie
          hierzu die{' '}
          <Link
            href="#"
            underline="hover"
            onClick={() => {
              setOpen(true);
            }}
          >
            Mitteilung nach § 19 Abs. 5 VVG
          </Link>
          ").
          <br></br>
          <br></br>
          Zudem bestätige ich, dass ich bei einem Träger der gesetzlichen Krankenversicherung (GKV) versichert bin bzw. dort ein Anspruch auf
          <br></br>
          Familienversicherung besteht oder Anspruch auf freie Heilfürsorge besteht.
        </Typography>
      </Grid>
    </>
  );
}
