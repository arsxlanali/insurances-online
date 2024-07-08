import Box from '@mui/material/Box';
import InsuranceInfo from './InsuranceInfo';
import { Divider } from '@mui/material';
import { useAppSelector } from '../../utils/hooks';
import TotalAmount from '../../components/TotalAmount';
import React from 'react';

interface Props {
  index: number;
  personIdx: number;
  personTotal: number;
  data:
    | {
        title: string;
        total: number;
        options: ContributionOption[];
      }[];
}

export default function InsuranceCharges({
  data,
  index,
  personIdx,
  personTotal,
}: Props) {
  let { personCount: persons } = useAppSelector((state) => state?.contribution);

  return (
    <>
      <Box>
        {data?.map((array, idx) => {
          let optionsLenght = 0;
          data.forEach((item) => {
            optionsLenght += item.options.length;
          });
          return array.options.length > 0 ? (
            <InsuranceInfo
              key={array?.title + idx}
              array={array}
              optionsLenght={optionsLenght}
              personIdx={personIdx}
              idx={idx}
              expanded={true}
            />
          ) : null;
        })}

        <Divider />
      </Box>
      {personTotal !== 0 && (
        <TotalAmount
          totalAmount={personTotal}
          disable={false}
          hide={persons > 1}
          text={`Beitrag Person ${index + 1}`}
        />
      )}
    </>
  );
}
