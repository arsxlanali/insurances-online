import {
  Typography,
  Divider,
  Stack,
  Pagination,
  Grid,
  Alert,
  Box,
} from '@mui/material';
import { useInsuranceRisk } from 'src/utils/hooks';
import DynamicForm from '../insuredperson/DynamicForm';
import Person from 'src/components/Person';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from 'src/utils/hooks';
import DefaultDateSelection from 'src/components/dateComponent/DefaultDateSelection';
import { setRiskIndex } from 'src/store/reducers/riskCheck.reducer';

interface Props {
  index: number;
}
export default function PersonSummary({ index }: Props) {
  const [insuranceRiskArray, person, , options] = useInsuranceRisk(index);
  const dispatch = useAppDispatch();
  const [riskIdxLocal, setRiskIndexLocal] = useState<number>(1);
  const insuranceRisk = insuranceRiskArray[riskIdxLocal - 1];
  const totalTariffs = useAppSelector(
    (state) => state.riskCheck.selectedInsurences[index - 1].riskCheckOptions
  ).length;
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setRiskIndexLocal(value);
    dispatch(setRiskIndex({ personIdx: index - 1, riskIdx: value }));
  };

  const renderNav = (
    <Box>
      <Grid padding={2}>
        <Grid item>
          <Alert severity="warning" sx={{ width: '100%' }}>
            Sie haben mehr als einen Tarif ausgewählt. Bitte prüfen Sie die
            Angaben aller Tarife.
          </Alert>
        </Grid>
      </Grid>
      <Grid
        container
        justifyContent={'flex-end'}
        alignItems={'center'}
        padding={1}
      >
        <Grid item>
          <Stack>
            <Pagination
              count={totalTariffs}
              page={riskIdxLocal}
              color="primary"
              onChange={handleChange}
            />
          </Stack>
        </Grid>
      </Grid>
      <Divider />
    </Box>
  );

  return (
    <Person
      index={index}
      title={person.title}
      options={options}
      defaultExpanded={true}
      riskIndex={riskIdxLocal}
      renderNav={renderNav}
      showCompletedTariffs={false}
    >
      <>
        <Alert
          severity="warning"
          sx={{ width: '100%', alignItems: 'center', marginY: 3 }}
        >
          <Box>
            <Typography sx={{ fontWeight: 'bold' }}>
              Bitte überprüfen Sie die nachfolgenden von Ihnen gemachten Angaben
              auf Vollständigkeit und Korrektheit.
            </Typography>
          </Box>
        </Alert>
        <Typography variant="h6" sx={{ pt: 3, pb: 1, fontWeight: 'bold' }}>
          Ihre gemachten Angaben:
        </Typography>
        <DefaultDateSelection />
        {insuranceRisk?.questionnaire ? (
          <DynamicForm
            questionaire={insuranceRisk.questionnaire}
            personId={person.Id}
            submitText=""
            readonly={true}
            riskIdx={riskIdxLocal - 1}
            personIdx={index}
          />
        ) : null}
      </>
    </Person>
  );
}
