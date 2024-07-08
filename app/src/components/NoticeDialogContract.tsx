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
export default function NoticeDialogContract({ open, setOpen }: Props) {
  return (
    <Dialog open={open}>
      <DialogTitle id="alert-dialog-title">
        Versicherungsvertragsgesetz §19 Abs. 5 - Anzeigepflicht
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" fontSize={15}>
          <ol style={{ paddingLeft: '1rem' }}>
            <li>
              Der Versicherungsnehmer hat bis zur Abgabe seiner
              Vertragserklärung die ihm bekannten Gefahrumstände, die für den
              Entschluss des Versicherers, den Vertrag mit dem vereinbarten
              Inhalt zu schließen, erheblich sind und nach denen der Versicherer
              in Textform gefragt hat, dem Versicherer anzuzeigen. Stellt der
              Versicherer nach der Vertragserklärung des Versicherungsnehmers,
              aber vor Vertragsannahme Fragen im Sinn des Satzes 1, ist der
              Versicherungsnehmer auch insoweit zur Anzeige verpflichtet.
            </li>
            <li>
              Verletzt der Versicherungsnehmer seine Anzeigepflicht nach Absatz
              1, kann der Versicherer vom Vertrag zurücktreten.
            </li>
            <li>
              Das Rücktrittsrecht des Versicherers ist ausgeschlossen, wenn der
              Versicherungsnehmer die Anzeigepflicht weder vorsätzlich noch grob
              fahrlässig verletzt hat. In diesem Fall hat der Versicherer das
              Recht, den Vertrag unter Einhaltung einer Frist von einem Monat zu
              kündigen.
            </li>
            <li>
              Das Rücktrittsrecht des Versicherers wegen grob fahrlässiger
              Verletzung der Anzeigepflicht und sein Kündigungsrecht nach Absatz
              3 Satz 2 sind ausgeschlossen, wenn er den Vertrag auch bei
              Kenntnis der nicht angezeigten Umstände, wenn auch zu anderen
              Bedingungen, geschlossen hätte. Die anderen Bedingungen werden auf
              Verlangen des Versicherers rückwirkend, bei einer vom
              Versicherungsnehmer nicht zu vertretenden Pflichtverletzung ab der
              laufenden Versicherungsperiode Vertragsbestandteil.
            </li>
            <li>
              Dem Versicherer stehen die Rechte nach den Absätzen 2 bis 4 nur
              zu, wenn er den Versicherungsnehmer durch gesonderte Mitteilung in
              Textform auf die Folgen einer Anzeigepflichtverletzung hingewiesen
              hat. Die Rechte sind ausgeschlossen, wenn der Versicherer den
              nicht angezeigten Gefahrumstand oder die Unrichtigkeit der Anzeige
              kannte.
            </li>
            <li>
              Erhöht sich im Fall des Absatzes 4 Satz 2 durch eine
              Vertragsänderung die Prämie um mehr als 10 Prozent oder schließt
              der Versicherer die Gefahrabsicherung für den nicht angezeigten
              Umstand aus, kann der Versicherungsnehmer den Vertrag innerhalb
              eines Monats nach Zugang der Mitteilung des Versicherers ohne
              Einhaltung einer Frist kündigen. Der Versicherer hat den
              Versicherungsnehmer in der Mitteilung auf dieses Recht
              hinzuweisen.
            </li>
          </ol>
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
