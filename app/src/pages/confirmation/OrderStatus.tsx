import { Box, Typography } from '@mui/material';
import Person from 'src/components/Person';
import { useInsuranceRisk } from 'src/utils/hooks';
import getStatusIcon from 'src/components/StatusIcon';
import AppConsts from 'src/config/appconst';

interface Props {
  index: number;
  statusFlag: boolean;
}

export default function OrderStatus({ index, statusFlag }: Props) {
  const [insuranceRiskArray, person, , options] = useInsuranceRisk(index);

  const orderNotAccepted = insuranceRiskArray.some((insuranceRisk: RiskCheckOption) => {
    return insuranceRisk?.questionnaire?.riskCheckStatus !== AppConsts.orderAccepted
  })
  return (
    <Person index={index} title={person.title} options={options} defaultExpanded={true} showCompletedTariffs={true}>
      <>
        {orderNotAccepted && (
            <Box>
              {!statusFlag && (
                <>
                  {getStatusIcon(false, 1)}
                  <Typography sx={{ fontSize: 16, pt: 2, textAlign: 'center' }}>
                    Beim Abschluss des Vertrages ist es zu einem Fehler gekommen
                    <br />
                  </Typography>
                </>
              )}
            </Box>
          )
        }
      </>
    </Person>
  );
}
