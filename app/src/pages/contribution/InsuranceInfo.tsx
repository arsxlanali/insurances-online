import React, { useEffect, useState } from 'react';
import {
  FormControlLabel,
  Checkbox,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  Box,
  Grid,
} from '@mui/material';
import TooltipReusable from '../../components/TooltipReusable';
import { ExpandMore } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import {
  selectOption,
  unselectOption,
} from '../../store/reducers/contribution.reducer';
import {
  addInsruanceForRiskCheck,
  removeInsuranceForRiskCheck,
} from 'src/store/reducers/riskCheck.reducer';
import { formatNumber } from 'src/utils/numberFormater';
import mandants from 'src/config/mandant';

interface Props {
  expanded: boolean;
  array: {
    title: string;
    total: number;
    options: ContributionOption[];
  };
  idx: number;
  personIdx: number;
  optionsLenght: number;
}
export default function InsuranceInfo({
  array,
  expanded,
  idx,
  personIdx,
  optionsLenght,
}: Props) {
  const dispatch = useAppDispatch();
  const [expand, setexpand] = useState<boolean>(expanded);
  const [numComponents, setNumComponents] = useState<number[]>([1]);
  const { mandant } = useAppSelector((state) => state.config);
  const exclusiveSelectionPerCategory: boolean = mandants[mandant as string]?.exclusiveSelectionPerCategory;

  useEffect(() => {
    if (optionsLenght === 1) {
      dispatch(
        selectOption({
          personIdx,
          optionIdx: 0,
          resIdx: idx,
          amount: array?.options[0]?.fee,
        })
      );
      dispatch(
        addInsruanceForRiskCheck({
          id: array?.options[0]?.id,
          personID: personIdx,
          option: {
            ...array?.options[0],
            orderAcceptedBenefitExclusion: null,
            orderAcceptedAdditionalFeeReason: null,
            orderAcceptedAdditionalFee: null,
            orderAcceptedDifferentFee: null,
          },
        })
      );
    }
    // eslint-disable-next-line
  }, []);

  const handleChange =
    () => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setexpand(newExpanded);
    };

  const isdisabled = (item: ContributionOption) => {
    if (!exclusiveSelectionPerCategory) {
      return false;
    }

    const hasAnotherSelectedOption = array.options.some(option => option.selected && option.id !== item.id);
    return hasAnotherSelectedOption;
  }

  return (
    <Accordion
      expanded={expand}
      onChange={handleChange()}
      sx={{
        boxShadow: 'none',
        margin: 'none',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      }}
      disableGutters
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
      >
        <Typography sx={{ color: 'primary.main' }} variant="h5">
          {array?.title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        <FormGroup sx={{ flexWrap: 'nowrap' }}>
          {array?.options?.map((item: ContributionOption, index: number) => {
            return (
              <FormControlLabel
                sx={{
                  margin: 0,
                  background: index % 2 ? 'transparent' : 'rgba(0, 0, 0, 0.06)',
                }}
                disableTypography
                key={item?.id}
                control={
                  <Checkbox
                    value={item?.displayString}
                    checked={item?.selected}
                    disabled={isdisabled(item)}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      if (event.target.checked) {
                        dispatch(
                          selectOption({
                            personIdx,
                            optionIdx: index,
                            resIdx: idx,
                            amount: item?.fee,
                          })
                        );
                        dispatch(
                          addInsruanceForRiskCheck({
                            id: item?.id,
                            personID: personIdx,
                            option: {
                              ...item,
                              orderAcceptedBenefitExclusion: null,
                              orderAcceptedAdditionalFeeReason: null,
                              orderAcceptedAdditionalFee: null,
                              orderAcceptedDifferentFee: null,
                            },
                          })
                        );
                      } else {
                        dispatch(
                          unselectOption({
                            personIdx,
                            optionIdx: index,
                            resIdx: idx,
                            amount: item?.fee,
                          })
                        );
                        dispatch(
                          removeInsuranceForRiskCheck({
                            id: item?.id,
                            personID: personIdx,
                          })
                        );
                      }
                    }}
                  />
                }
                label={
                  <Grid container>
                    <Grid
                      container
                      item
                      sm={12}
                      xs={10}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Grid item sm={4} xs={12} paddingY={1}>
                        {item?.insuranceName}
                      </Grid>
                      <Grid item sm={3} xs={12} paddingY={1}>
                        {item?.displayString}
                      </Grid>

                      <Grid item sm={2} display={{ xs: 'none', sm: 'initial' }}>
                        <TooltipReusable
                          tarrifId={item?.tarrifId}
                          personIdx={personIdx}
                          key={item?.id}
                          title={Object.values(item?.descriptions)}
                        />
                      </Grid>

                      <Grid
                        item
                        sm={3}
                        xs={12}
                        paddingY={1}
                        fontStyle={'italic'}
                      >
                        {formatNumber(item?.fee)} EUR / Monat
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      justifyContent={'center'}
                      alignItems={'center'}
                      display={{ sm: 'none', xs: 'flex' }}
                    >
                      <TooltipReusable
                        key={item.id}
                        tarrifId={item?.tarrifId}
                        personIdx={personIdx}
                        title={Object.values(item?.descriptions)}
                      />
                    </Grid>
                  </Grid>
                }
              />
            );
          })}
          <Box>
            <Typography component={'span'} variant={'subtitle1'}>
              Beitrag ausgewählte(r) Tarif(e): {formatNumber(array?.total)} EUR
              / Monat
            </Typography>
          </Box>
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );
}
