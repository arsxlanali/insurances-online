import { Divider } from '@mui/material';
import { Box } from '@mui/system';
import { useAppSelector } from '../../utils/hooks';
import Personscomp from './PersonsComp';
// import Footernav from 'src/components/Footernav';
import { useEffect } from 'react';
// import AppConsts from 'src/config/appconst';

export default function Insuredperson() {
  const { persons } = useAppSelector((state) => state.contribution);
  // const selectedInsurences = useAppSelector(
  //   (state) => state.riskCheck.selectedInsurences
  // );
  // const showNext = () => {
  //   const riskCheckStatusArray: boolean[] = [];
  //   Object.keys(selectedInsurences).forEach((key) => {
  //     if (
  //       selectedInsurences[key].riskCheckOptions.every(
  //         (e) =>
  //           e.questionnaire?.riskCheckStatus === AppConsts.orderWaitingSubmit
  //       )
  //     ) {
  //       riskCheckStatusArray.push(true);
  //     } else {
  //       riskCheckStatusArray.push(false);
  //     }
  //   });
  //   return riskCheckStatusArray.every((e) => e);
  // };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box>
      <Divider />
      {persons.map((person, index) => (
        <Personscomp
          key={index}
          index={index + 1}
          gender={person?.gender}
          bithdate={person.birthdate}
        />
      ))}
      {/* <Footernav disableNext={!showNext()} /> */}
    </Box>
  );
}
