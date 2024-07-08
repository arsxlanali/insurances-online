import {
  Stepper,
  Step,
  StepLabel,
  Avatar,
  StepIconProps,
  Grid,
} from '@mui/material';
import { ArrowForwardIos, Check } from '@mui/icons-material';
import { useMediaQuery } from '@mui/material';
import { useAppSelector } from '../utils/hooks';
import { defaultTheme } from 'src/config/theme';

const steps = ['Beitrag', 'Antragsdaten', 'Zusammenfassung'];

function AvatarIcon(props: StepIconProps) {
  const { active, completed } = props;

  return (
    <Avatar
      sx={{
        width: 32,
        height: 32,
        bgcolor: active || completed ? 'primary.main' : 'grey.400',
        fontSize: '1rem',
      }}
    >
      {String(props.icon)}
    </Avatar>
  );
}

function FinishIcon(props: StepIconProps) {
  const { active, completed } = props;

  return (
    <Avatar
      sx={{
        width: 32,
        height: 32,
        bgcolor: active || completed ? 'primary.main' : 'grey.400',
        fontSize: '1rem',
      }}
    >
      <Check />
    </Avatar>
  );
}

export default function InsuranceStep() {
  const showComponent = useMediaQuery(defaultTheme.breakpoints.up('sm'));
  const step = useAppSelector((state) => state?.stepper?.steps);
  return (
    <Grid>
      <Stepper
        activeStep={step}
        sx={{
          height: 100,
          maxWidth: 700,
          justifyContent: 'space-around',
          margin: 'auto',
          '& span': {
            fontSize: '1rem',
          },
        }}
        connector={
          <ArrowForwardIos fontSize="small" sx={{ color: 'grey.400' }} />
        }
      >
        {steps.map((label) => (
          <Step
            key={label}
            sx={{
              paddingLeft: { xs: 0, sm: 1 },
              paddingRight: { xs: 0, sm: 1 },
            }}
          >
            <StepLabel
              StepIconComponent={AvatarIcon}
              sx={{
                '& .MuiStepLabel-iconContainer': {
                  paddingRight: { xs: 0, sm: 1 },
                },
              }}
            >
              {showComponent && label}
            </StepLabel>
          </Step>
        ))}
        <Step key={'finish'}>
          <StepLabel StepIconComponent={FinishIcon} />
        </Step>
      </Stepper>
    </Grid>
  );
}
