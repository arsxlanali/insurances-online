import ClickAwayListener from '@mui/base/ClickAwayListener';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Rating,
  Tooltip,
  Typography,
} from '@mui/material';
import { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { Theme } from '@mui/system';
import { useState } from 'react';
import CustomInfoIcon from 'src/asserts/CustomInfo';
import { getTariffsRating } from 'src/store/thunks/contribution.thunk';
import { getTextColor } from 'src/utils';
import { useAppDispatch, useAppSelector } from 'src/utils/hooks';
import mandants from '../config/mandant';

export const CustomWidthTooltip = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  )
)({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
  },
});
interface Props {
  title: string[];
  isHeader?: boolean;
  isActive?: boolean;
  iconFlag?: boolean;
  tarrifId?: string;
  personIdx?: number;
}

export default function TooltipReusable({
  title,
  isActive,
  isHeader,
  iconFlag = true,
  tarrifId,
  personIdx,
}: Props) {
  const [show, setShow] = useState(false);
  const { mandant } = useAppSelector((state) => state.config);
  const persons = useAppSelector((state) => state.contribution.persons);
  const dispatch = useAppDispatch();

  type Mandant = keyof typeof mandants;
  const allowRattings: boolean = mandants[mandant as Mandant].allowRattings;

  const ratingValues: RatingValues = {
    premium: 5,
    comfort: 4,
    base: 3,
    none: 0,
  };

  const ratingText = {
    premium: 'Premium',
    comfort: 'Komfort',
    base: 'Basis',
    none: 'Nicht bewertet',
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        setShow(false);
      }}
    >
      <CustomWidthTooltip
        slotProps={{
          tooltip: {
            sx: {
              fontSize: '1em',
              padding: '30px',
              borderRadius: '0px',
              color: 'gray',
              backgroundColor: 'white',
              boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
            },
          },
        }}
        enterTouchDelay={100}
        open={show}
        onMouseEnter={() => {
          setShow(true);

          if (
            tarrifId &&
            personIdx !== undefined &&
            persons[personIdx].ratings[tarrifId] === null &&
            allowRattings
          ) {
            dispatch(getTariffsRating({ tarrifId, mandant, personIdx }));
          }
        }}
        onMouseLeave={() => {
          setShow(false);
        }}
        onTouchStart={() => {
          setShow(true);
          if (
            tarrifId &&
            personIdx !== undefined &&
            persons[personIdx].ratings[tarrifId] === null &&
            allowRattings
          ) {
            dispatch(getTariffsRating({ tarrifId, mandant, personIdx }));
          }
        }}
        onFocus={() => {
          setShow(true);
          if (
            tarrifId &&
            personIdx !== undefined &&
            persons[personIdx].ratings[tarrifId] === null &&
            allowRattings
          ) {
            dispatch(getTariffsRating({ tarrifId, mandant, personIdx }));
          }
        }}
        title={
          <Box>
            <Box sx={{ textAlign: 'end' }}>
              <HighlightOffIcon
                onClick={() => setShow(false)}
                sx={{ cursor: 'pointer' }}
              />
            </Box>

            {personIdx !== undefined &&
              tarrifId &&
              persons[personIdx].ratings[tarrifId] !== null &&
              persons[personIdx]?.ratings[tarrifId]?.map(
                (rating: any, index: number) => {
                  if (index === 0) {
                    return (
                      <>
                        <Typography
                          variant="h6"
                          color={'primary'}
                          paddingBottom={1}
                        >
                          Tarifqualität
                        </Typography>
                        <Grid container key={index}>
                          <Grid item xs={5} sm={7}>
                            {rating?.questionSmallTitle}
                          </Grid>
                          <Grid item xs={4} sm={3}>
                            <Rating
                              name="read-only"
                              readOnly
                              value={
                                ratingValues[
                                  rating?.selectedAnswer
                                    ?.answerId as keyof RatingValues
                                ]
                              }
                            />
                          </Grid>
                          <Grid item xs={3} sm={2}>
                            {
                              ratingText[
                                rating?.selectedAnswer
                                  ?.answerId as keyof RatingValues
                              ]
                            }
                          </Grid>
                        </Grid>
                      </>
                    );
                  }
                  return (
                    <Grid container key={index}>
                      <Grid item xs={5} sm={7}>
                        {rating?.questionSmallTitle}
                      </Grid>
                      <Grid item xs={4} sm={3}>
                        <Rating
                          name="read-only"
                          readOnly
                          value={
                            ratingValues[
                              rating?.selectedAnswer
                                ?.answerId as keyof RatingValues
                            ]
                          }
                        />
                      </Grid>
                      <Grid item xs={3} sm={2}>
                        {
                          ratingText[
                            rating?.selectedAnswer
                              ?.answerId as keyof RatingValues
                          ]
                        }
                      </Grid>
                    </Grid>
                  );
                }
              )}
            {personIdx !== undefined && persons[personIdx].loading && (
              <Box display={'flex'} justifyContent={'center'} paddingY={3}>
                <CircularProgress />{' '}
              </Box>
            )}
            {personIdx !== undefined && tarrifId && (
              <Typography variant="h6" color={'primary'} paddingTop={1}>
                Leistungskurzbeschreibung
              </Typography>
            )}
            <ul style={{ padding: '0' }}>
              {title.map((item, index) => {
                const htmlStr = item
                  .replace(/\n/g, '<br>')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&#039;');
                return (
                  <div
                    key={index}
                    dangerouslySetInnerHTML={{ __html: htmlStr }}
                  ></div>
                );
              })}
            </ul>
          </Box>
        }
      >
        <Button
          disableRipple
          sx={{
            minWidth: '0',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          {iconFlag ? (
            isHeader ? (
              <Box position={'relative'} zIndex={2} top={'3px'}>
                <Box
                  bgcolor={getTextColor(mandant)}
                  position={'absolute'}
                  top={'3px'}
                  left={'3px'}
                  sx={{
                    height: '15px',
                    width: '15px',
                    zIndex: -1,
                    borderRadius: '50%',
                  }}
                ></Box>
                <CustomInfoIcon
                  sx={{
                    color: (theme) => {
                      const customInfoIconColor =
                        theme.palette?.customInfoIconColor;
                      if (customInfoIconColor) {
                        if (isActive) {
                          return customInfoIconColor.main;
                        } else if (isHeader) {
                          return customInfoIconColor.main;
                        }
                      } else {
                        return 'secondary.main';
                      }
                    },
                  }}
                  fill={(theme: Theme) => {
                    const customInfoIconColor =
                      theme.palette?.customInfoIconColor;
                    if (customInfoIconColor) {
                      if (isActive) {
                        return customInfoIconColor.text;
                      } else if (isHeader) {
                        return customInfoIconColor?.textPersonHeader;
                      }
                    } else {
                      return 'white';
                    }
                  }}
                />
              </Box>
            ) : (
              <CustomInfoIcon
                sx={{
                  color: (theme) => {
                    const customInfoIconColor =
                      theme.palette?.customInfoIconColor;
                    if (customInfoIconColor) {
                      if (isActive) {
                        return customInfoIconColor.main;
                      } else if (isHeader) {
                        return 'primary.main';
                      }
                    } else {
                      return 'primary.main';
                    }
                  },
                }}
                fill={(theme: Theme) => {
                  const customInfoIconColor =
                    theme.palette?.customInfoIconColor;
                  if (customInfoIconColor) {
                    if (isActive) {
                      return customInfoIconColor.text;
                    } else if (isHeader) {
                      return customInfoIconColor?.textPersonHeader;
                    } else {
                      return 'white';
                    }
                  } else {
                    return 'white';
                  }
                }}
              />
            )
          ) : (
            <WarningAmberIcon color="warning" />
          )}
        </Button>
      </CustomWidthTooltip>
    </ClickAwayListener>
  );
}
