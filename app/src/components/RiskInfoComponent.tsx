import React from 'react';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { formatNumber } from 'src/utils/numberFormater';

interface Props {
  riskIndex: number;
  options: ContributionOptionExclusive[];
}

const RiskInfoComponent = ({ riskIndex, options }: Props) => {
  if (!(riskIndex && options)) {
    return null;
  }

  const hasBenefitExclusion =
    options[riskIndex - 1]?.orderAcceptedBenefitExclusion;
  const hasAdditionalFee = options[riskIndex - 1]?.orderAcceptedAdditionalFee;
  const hasDifferentFee = options[riskIndex - 1]?.orderAcceptedDifferentFee;
  const hasDifferentFeeReason =
    options[riskIndex - 1]?.orderAcceptedAdditionalFeeReason;
  const hasFee = options[riskIndex - 1]?.fee;

  if (hasBenefitExclusion || hasAdditionalFee || hasDifferentFee) {
    return (
      <>
        <Typography
          variant="h6"
          sx={{ py: 3, pr: 5, fontWeight: 'bold', whiteSpace: 'nowrap' }}
        >
          {hasBenefitExclusion
            ? hasAdditionalFee
              ? 'Leistungsausschluss und Risikozuschlag:'
              : 'Leistungsausschluss:'
            : 'Risikozuschlag:'}
        </Typography>
        {hasBenefitExclusion && (
          <Alert severity="warning" sx={{ marginY: 1 }}>
            <Typography>
              Der Versicherer informiert über folgende Leistungsaussschlüsse:{' '}
              {hasBenefitExclusion}
            </Typography>
          </Alert>
        )}
        {(hasAdditionalFee || hasDifferentFee) && (
          <Alert severity="warning" sx={{ marginBottom: 2 }}>
            <Typography>
              Der Versicherer erhebt einen Risikozuschlag in Höhe von:{' '}
              {hasAdditionalFee ??
                (hasDifferentFee &&
                  `${formatNumber(
                    parseFloat(hasDifferentFee?.replace(',', '.')) - hasFee
                  )} €`)}
            </Typography>
            {hasDifferentFeeReason && (
              <Typography>
                Die Begründung des Versicherers lautet: {hasDifferentFeeReason}.
              </Typography>
            )}
            <Typography>
              Der neue Preis des Tarifs inklusive Risikozuschlag lautet:{' '}
              {hasDifferentFee}
            </Typography>
          </Alert>
        )}
      </>
    );
  }

  return null;
};

export default RiskInfoComponent;
