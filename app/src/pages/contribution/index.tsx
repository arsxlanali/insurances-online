import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Divider, Grid, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';
import Person from 'src/components/Person';
import mandants from 'src/config/mandant';
import {
  addSelectedInsurance,
  removeSelectedInsurance,
} from 'src/store/reducers/riskCheck.reducer';
import { uid } from 'uid';
import TotalAmount from '../../components/TotalAmount';
import {
  decrementByAmount,
  personIncrement,
  persondecrement,
} from '../../store/reducers/contribution.reducer';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import ContributionInfo from './ContributionInfo';
import InsuranceCharges from './InsuranceCharges';
import DateComponent from 'src/config/DateComponent';

export default function Contribution() {
  const [numComponents, setNumComponents] = useState<number[]>([1]);
  const { mandant } = useAppSelector((state) => state.config);
  type Mandant = keyof typeof mandants;
  const maxPerson: number = mandants[mandant as Mandant]?.maxPerson;

  const dispatch = useAppDispatch();
  const addComponent = () => {
    dispatch(personIncrement(uid(16)));
    dispatch(
      addSelectedInsurance({
        personID: numComponents[numComponents.length - 1],
      })
    );
  };

  const removeComponent = (index: number) => {
    dispatch(decrementByAmount());
    dispatch(persondecrement(index));
    setNumComponents([...numComponents].splice(index, 1));
    dispatch(removeSelectedInsurance());
  };
  const {
    totalAmount,
    personCount: persons,
    personsId,
    persons: response,
  } = useAppSelector((state) => state?.contribution);

  useEffect(() => {
    setNumComponents(new Array(persons).fill('').map((_, i) => i + 1));
  }, [persons]);

  return (
    <div>
      <DateComponent />
      <Divider />
      {numComponents.map((i) => {
        const index = response.findIndex(
          (person: any) => person.Id === personsId[i - 1]
        );
        return (
          <Person
            index={i}
            title=""
            key={`${i}person`}
            defaultExpanded={true}
            showCompletedTariffs={false}
          >
            <>
              <ContributionInfo
                index={i}
                removeComponent={removeComponent}
                lenght={persons}
                birthdate={response[index]?.birthdate}
                genderProp={response[index]?.gender || ''}
              />

              {index !== -1 && (
                <InsuranceCharges
                  key={response[index].Id}
                  personIdx={index}
                  data={response[index].res}
                  personTotal={response[index].total}
                  index={index}
                />
              )}
            </>
          </Person>
        );
      })}
      {(maxPerson === 0 || persons < maxPerson) && (
        <Grid display="flex" alignItems="center" marginY={3}>
          <IconButton aria-label="delete" size="large" onClick={addComponent}>
            <AddCircleOutlineIcon
              sx={{ fontSize: '48px', color: 'primary.main' }}
            />
          </IconButton>
          <Typography variant="h5" color="primary.main">
            Weitere Person versichern
          </Typography>
        </Grid>
      )}

      {persons > 1 && totalAmount !== 0 && (
        <TotalAmount
          totalAmount={totalAmount}
          hide={false}
          disable={response.some((p) => p.total === 0)}
          text={'Beitrag Gesamt'}
        />
      )}
    </div>
  );
}
