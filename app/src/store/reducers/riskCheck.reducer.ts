import { createSlice } from '@reduxjs/toolkit';
import { showError } from 'src/utils/toast';
import {
  checkRiskCheckAdditional,
  startRiskCheckAdditional,
} from '../thunks/riskCheck.thunk';
import { insuranceOccupation } from '../thunks/occupation.thunk';
import AppConsts from 'src/config/appconst';
import { submitOrder } from '../thunks/order.thunk';
import {
  getTarrifDocuments,
  getRiskCheckDocuments,
} from '../thunks/document.thunk';
import { PayloadAction } from '@reduxjs/toolkit';
import { getOptionValuesByKeys } from 'src/utils';

export const initialState: RiskCheckState = {
  occupations: [],
  selectedInsurences: {
    0: {
      riskCheckOptions: [],
      previousQuestionaire: { eMail: '' },
      openNotice: true,
      riskCheckIdx: -1,
    },
  },
  order: '',
  orderStatus: false,
  documents: [],
  isDownloading: false,
};

const riskCheckSlice = createSlice({
  name: 'riskCheck',
  initialState,
  reducers: {
    addQuestionaire: (
      state,
      action: PayloadAction<{ personIdx: number; values: any }> // Update with the actual type for values
    ) => {
      const { personIdx, values } = action.payload;
      state.selectedInsurences[personIdx].previousQuestionaire = {
        ...state.selectedInsurences[personIdx].previousQuestionaire,
        ...values,
      };
    },

    setLabelQuestionaire: (
      state,
      action: PayloadAction<{
        personIdx: number;
        riskIdx: number;
        questionnaireStep: number;
      }>
    ) => {
      const { personIdx, riskIdx, questionnaireStep } = action.payload;
      const setAnswerValueRecursive = (questions: Question[]) => {
        if (!questions || questions.length === 0) {
          return;
        }
        questions.forEach((question: Question) => {
          if (
            question.answer.type === 'Label' &&
            question.questionaireStep === questionnaireStep
          ) {
            question.answer.alreadyAnswered = true;
            if (question?.childQuestionary) {
              question?.childQuestionary.forEach((child: any) => {
                setAnswerValueRecursive(child.questions);
              });
            }
          }
        });
      };
      const selectedInsurance =
        state.selectedInsurences[personIdx].riskCheckOptions[riskIdx];
      if (selectedInsurance?.questionnaire) {
        setAnswerValueRecursive(selectedInsurance.questionnaire.questions);
      }
    },
    setOpenNoticeTrue: (
      state,
      action: PayloadAction<{ personIdx: number }>
    ) => {
      const { personIdx } = action.payload;
      state.selectedInsurences[personIdx].openNotice = true;
    },
    setOpenNoticeFalse: (
      state,
      action: PayloadAction<{ personIdx: number }>
    ) => {
      const { personIdx } = action.payload;
      state.selectedInsurences[personIdx].openNotice = false;
    },
    addQuestionaireStep: (
      state,
      action: PayloadAction<{ personIdx: number; riskIdx: number }>
    ) => {
      const { personIdx, riskIdx } = action.payload;
      state.selectedInsurences[personIdx].riskCheckOptions[
        riskIdx
      ].questionnaireStep += 1;
      state.selectedInsurences[personIdx].riskCheckOptions[
        riskIdx
      ].questionnaireStepTotal += 1;
    },
    setRiskIndex: (
      state,
      action: PayloadAction<{ personIdx: number; riskIdx: number }>
    ) => {
      const { personIdx, riskIdx } = action.payload;
      state.selectedInsurences[personIdx].riskCheckIdx = riskIdx;
    },
    addQuestionaireStepBack: (
      state,
      action: PayloadAction<{ personIdx: number; riskIdx: number }>
    ) => {
      const { personIdx, riskIdx } = action.payload;
      state.selectedInsurences[personIdx].riskCheckOptions[
        riskIdx
      ].questionnaireStep += 1;
    },
    addQuestionaireSteptoTotal: (
      state,
      action: PayloadAction<{ personIdx: number; riskIdx: number }>
    ) => {
      const { personIdx, riskIdx } = action.payload;
      state.selectedInsurences[personIdx].riskCheckOptions[
        riskIdx
      ].questionnaireStep =
        state.selectedInsurences[personIdx].riskCheckOptions[
          riskIdx
        ].questionnaireStepTotal;
    },
    removeQuestionaireStep: (
      state,
      action: PayloadAction<{ personIdx: number; riskIdx: number }>
    ) => {
      const { personIdx, riskIdx } = action.payload;
      if (
        state.selectedInsurences[personIdx].riskCheckOptions[riskIdx]
          .questionnaireStep > 0
      ) {
        state.selectedInsurences[personIdx].riskCheckOptions[
          riskIdx
        ].questionnaireStep -= 1;
      }
    },
    addSelectedInsurance: (state, action) => {
      const { personID } = action.payload;
      if (state.selectedInsurences[personID]) {
        state.selectedInsurences[personID].riskCheckOptions.push();
      } else {
        state.selectedInsurences[personID] = {
          previousQuestionaire: { eMail: '' },
          riskCheckOptions: [],
          openNotice: true,
          riskCheckIdx: -1,
        };
      }
    },
    removeSelectedInsurance: (state) => {
      const personID = Object.keys(state.selectedInsurences);
      if (personID.length > 0) {
        const lastKey = personID[personID.length - 1];
        delete state.selectedInsurences[lastKey];
      }
    },
    addInsruanceForRiskCheck: (
      state,
      { payload: { id, personID, option } }
    ) => {
      if (
        !state.selectedInsurences[personID]?.riskCheckOptions.some(
          (i: any) => i.id === id
        )
      ) {
        state.selectedInsurences[personID]?.riskCheckOptions.push({
          id,
          option: option,
          loading: false,
          moreQuestions: false,
          questionnaireStep: 0,
          questionnaireStepTotal: 0,
        });
      }
    },
    removeInsuranceForRiskCheck: (state, { payload: { id, personID } }) => {
      const index = state.selectedInsurences[
        personID
      ]?.riskCheckOptions.findIndex((i) => i.id === id);
      if (index !== -1) {
        state.selectedInsurences[personID].riskCheckOptions.splice(index, 1);
      }
      return state;
    },
    saveQuestionsValues: (state, { payload: { values, idx, personIdx } }) => {
      const setAnswerValueRecursive = (questions: Question[], values: any) => {
        if (!questions || questions.length === 0) {
          return;
        }
        questions.forEach((question) => {
          const value = values[question.key];

          if (value !== undefined) {
            question.answer.value = value.toString();
          }

          if (question?.childQuestionary) {
            question?.childQuestionary.forEach((child: any) => {
              setAnswerValueRecursive(child.questions, values);
            });
          }
        });
      };

      const cloneState = (state: any) => JSON.parse(JSON.stringify(state));
      const newState = cloneState(state); // Clone the state to avoid direct modification
      const questions =
        newState.selectedInsurences[personIdx].riskCheckOptions[idx]
          .questionnaire?.questions;

      if (questions) {
        setAnswerValueRecursive(questions, values);
      }

      return newState;
    },
    setOrderTrue: (state) => {
      state.orderStatus = true;
    },
    setOrderFalse: (state) => {
      state.orderStatus = false;
    },
    setDownlaodStart: (state) => {
      state.isDownloading = true;
    },
    setDownloadEnd: (state) => {
      state.isDownloading = false;
    },
    updateChildVisibility: (state, action): RiskCheckState => {
      const { key, visible, value, riskIdx, personIdx } = action.payload;
      const { selectedInsurences } = state;

      function updateChildVisibleByKeyFalse(
        childQuestionary: Question[] | null,
        value: any,
        visible: boolean
      ): Question[] | null {
        if (!childQuestionary) {
          return null;
        }

        return childQuestionary.map((child: any) => {
          const childVisible =
            value === child?.expChild || childQuestionary.length === 1
              ? visible
              : !visible;

          return {
            ...child,
            questions: child?.questions.map((q: Question) => ({
              ...q,
              childQuestionary: updateChildVisibleByKeyFalse(
                q.childQuestionary,
                value,
                false
              ), // Recursively set childQuestionary visibility to false
              visible: childVisible, // Set visibility based on the condition
            })),
          };
        });
      }

      function updateChildVisibleByKey(questions: Question[]): Question[] {
        return questions?.map((question: Question) => {
          const childQuestion = question?.childQuestionary;

          if (question.key === key && childQuestion) {
            const updatedChildQuestionary = childQuestion.map((child: any) => {
              return {
                ...child,
                questions: child?.questions.map((q: Question) => ({
                  ...q,
                  childQuestionary: updateChildVisibleByKeyFalse(
                    q.childQuestionary,
                    value,
                    false
                  ), // Call the function recursively
                  visible:
                    value === child?.expChild || childQuestion.length === 1
                      ? visible
                      : !visible,
                })),
              };
            });

            return {
              ...question,
              childQuestionary: updatedChildQuestionary,
            };
          } else if (childQuestion) {
            const updatedChildQuestionary = childQuestion.map((qChild: any) => {
              return {
                ...qChild,
                questions: updateChildVisibleByKey(qChild.questions),
              };
            });

            return {
              ...question,
              childQuestionary: updatedChildQuestionary,
            };
          }
          return question;
        });
      }

      const updatedSelectedInsurances = {
        ...selectedInsurences,
        [personIdx]: {
          ...selectedInsurences[personIdx],
          riskCheckOptions: selectedInsurences[personIdx].riskCheckOptions.map(
            (insurance: RiskCheckOption, index: number): RiskCheckOption => {
              if (index === riskIdx && insurance?.questionnaire) {
                const updatedQuestionnaire = updateChildVisibleByKey(
                  insurance?.questionnaire?.questions
                );
                return {
                  ...insurance,
                  questionnaire: {
                    ...insurance.questionnaire,
                    questions: updatedQuestionnaire,
                  },
                };
              }
              return insurance;
            }
          ),
        },
      };

      return { ...state, selectedInsurences: updatedSelectedInsurances };
    },
    reverseVisibility: (state, action) => {
      const setAnswerValueRecursive = (questions: Question[]) => {
        if (!questions || questions.length === 0) {
          return;
        }
        questions.forEach((question) => {
          question.readonly = false; // Toggle readonly
          if (question?.childQuestionary) {
            question?.childQuestionary.forEach((child: any) => {
              setAnswerValueRecursive(child.questions);
            });
          }
        });
      };
      const selectedInsurance =
        state.selectedInsurences[action.payload.personIdx]?.riskCheckOptions[
          action.payload.riskIdx
        ];
      if (selectedInsurance?.questionnaire) {
        setAnswerValueRecursive(selectedInsurance.questionnaire.questions);
      }
    },
    addDocuments: (state, action: PayloadAction<DownloadDoc[]>) => {
      state.documents.push(...action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      startRiskCheckAdditional.fulfilled,
      (state, { payload, meta }) => {
        state.selectedInsurences[meta.arg.personIdx].openNotice = false;
        const selectedInsurance =
          state.selectedInsurences[meta.arg.personIdx].riskCheckOptions[
            meta.arg.riskIdx
          ];
        selectedInsurance.loading = false;
        const { option, questionnaireStep, questionnaireStepTotal } =
          selectedInsurance;
        const { questionaryValues } = payload;
        selectedInsurance.option = {
          ...getOptionValuesByKeys(
            questionaryValues,
            option,
            questionnaireStep,
            questionnaireStepTotal
          ),
        };
        payload.questions.forEach((q) => {
          const prev = Object.entries(meta.arg.values).find(
            ([k, _]) => k === q.key
          );
          if (prev) {
            q.answer.alreadyAnswered = true;
          }
        });

        selectedInsurance.questionnaire = payload;
      }
    );
    builder.addCase(
      startRiskCheckAdditional.rejected,
      (state, { error, meta }) => {
        const selectedInsurance =
          state.selectedInsurences[meta.arg.personIdx].riskCheckOptions[
            meta.arg.riskIdx
          ];
        selectedInsurance.loading = false;
        showError(error.message ?? 'Error');
      }
    );
    builder.addCase(startRiskCheckAdditional.pending, (state, { meta }) => {
      const selectedInsurance =
        state.selectedInsurences[meta.arg.personIdx].riskCheckOptions[
          meta.arg.riskIdx
        ];
      selectedInsurance.loading = true;
    });
    builder.addCase(
      checkRiskCheckAdditional.fulfilled,
      (state, { payload, meta }) => {
        const setAnswerValueRecursive = (questions: Question[]) => {
          if (!questions || questions.length === 0) {
            return;
          }

          questions.forEach((question: Question) => {
            question.readonly = true;
            question.answer.alreadyAnswered = true;

            if (question?.childQuestionary) {
              question?.childQuestionary.forEach((child: any) => {
                setAnswerValueRecursive(child.questions);
              });
            }
          });
        };
        const selectedInsurance =
          state.selectedInsurences[meta.arg.personIdx].riskCheckOptions[
            meta.arg.riskIdx
          ];
        selectedInsurance.loading = false;

        const { option, questionnaireStep, questionnaireStepTotal } =
          selectedInsurance;
        const { questionaryValues } = payload;
        selectedInsurance.option = {
          ...getOptionValuesByKeys(
            questionaryValues,
            option,
            questionnaireStep,
            questionnaireStepTotal
          ),
        };
        const { personIdx, riskIdx } = meta.arg;

        if (questionnaireStep < questionnaireStepTotal) {
          if (payload.riskCheckStatus !== AppConsts.orderWaitingSubmit) {
            state.selectedInsurences[personIdx].riskCheckOptions[
              riskIdx
            ].questionnaireStep += 1;
          } else {
            state.selectedInsurences[personIdx].riskCheckOptions[
              riskIdx
            ].questionnaireStep =
              state.selectedInsurences[personIdx].riskCheckOptions[
                riskIdx
              ].questionnaireStepTotal;
          }
        } else {
          state.selectedInsurences[personIdx].riskCheckOptions[
            riskIdx
          ].questionnaireStep += 1;
          state.selectedInsurences[personIdx].riskCheckOptions[
            riskIdx
          ].questionnaireStepTotal += 1;
        }

        selectedInsurance.moreQuestions = true;
        if (selectedInsurance.questionnaire) {
          selectedInsurance.questionnaire.riskCheckStatus =
            payload.riskCheckStatus;
          selectedInsurance.questionnaire.riskCheckId = payload.riskCheckId;
          if (payload.riskCheckStatus === AppConsts.orderWaitingSubmit) {
            setAnswerValueRecursive(selectedInsurance.questionnaire.questions);
          } else {
            payload.questions.forEach((q) => {
              const prev = selectedInsurance.questionnaire?.questions.find(
                (p) => p.key === q.key
              );
              if (!prev) {
                selectedInsurance.questionnaire?.questions.push(q);
              }
            });
            selectedInsurance.questionnaire.questions.forEach((q) => {
              if (
                meta.arg.values[q.key]?.toString() ||
                selectedInsurance.questionnaire?.questionaryValues.some(
                  (qv) => qv.key === q.key
                )
              )
                q.answer.alreadyAnswered = true;
            });
            selectedInsurance.questionnaire.questionaryValues =
              payload.questionaryValues;
          }
        }
      }
    );
    builder.addCase(
      checkRiskCheckAdditional.rejected,
      (state, { error, meta }) => {
        const selectedInsurance =
          state.selectedInsurences[meta.arg.personIdx].riskCheckOptions[
            meta.arg.riskIdx
          ];
        selectedInsurance.loading = false;
        showError(error.message ?? 'Error');
      }
    );
    builder.addCase(checkRiskCheckAdditional.pending, (state, { meta }) => {
      const selectedInsurance =
        state.selectedInsurences[meta.arg.personIdx].riskCheckOptions[
          meta.arg.riskIdx
        ];
      selectedInsurance.loading = true;
      selectedInsurance.moreQuestions = false;
    });
    builder.addCase(insuranceOccupation.fulfilled, (state, { payload }) => {
      state.occupations = payload;
    });
    builder.addCase(getTarrifDocuments.fulfilled, (state, { payload }) => {
      state.documents = payload.map((doc) => JSON.parse(JSON.stringify(doc)));
    });
    builder.addCase(
      getRiskCheckDocuments.fulfilled,
      (state, { payload, meta }) => {
        Object.keys(state.selectedInsurences).forEach((key) => {
          const ques = state.selectedInsurences[key].riskCheckOptions.find(
            (i) => i.questionnaire?.riskCheckId === meta.arg.riskCheckId
          )?.questionnaire;
          if (ques) {
            ques.loading = false;
            ques.documents = payload.map((doc) =>
              JSON.parse(JSON.stringify(doc))
            );
          }
        });
      }
    );
    builder.addCase(getRiskCheckDocuments.pending, (state, { meta }) => {
      Object.keys(state.selectedInsurences).forEach((key) => {
        const ques = state.selectedInsurences[key].riskCheckOptions.find(
          (i) => i.questionnaire?.riskCheckId === meta.arg.riskCheckId
        )?.questionnaire;
        if (ques) {
          ques.loading = true;
        }
      });
    });
    builder.addCase(submitOrder.fulfilled, (state, { payload }) => {
      state.order = 'fulfilled';
      payload.forEach((questionaire) => {
        if (questionaire) {
          Object.keys(state.selectedInsurences).forEach((key) => {
            const ques = state.selectedInsurences[key].riskCheckOptions.find(
              (i) => i.questionnaire?.riskCheckId === questionaire.riskCheckId
            )?.questionnaire;
            if (ques) {
              ques.riskCheckStatus = questionaire.riskCheckStatus;
              ques.referenceId = questionaire.referenceId;
            }
          });
        }
      });
    });
    builder.addCase(submitOrder.rejected, (state, { error }) => {
      state.order = 'rejected';
      showError(error.message ?? 'Error');
    });
    builder.addCase(submitOrder.pending, (state) => {
      state.order = 'pending';
    });
  },
});

export const {
  addSelectedInsurance,
  setLabelQuestionaire,
  addQuestionaireStep,
  addDocuments,
  setRiskIndex,
  setOpenNoticeTrue,
  setOpenNoticeFalse,
  addQuestionaireStepBack,
  removeQuestionaireStep,
  addQuestionaireSteptoTotal,
  removeSelectedInsurance,
  addInsruanceForRiskCheck,
  removeInsuranceForRiskCheck,
  saveQuestionsValues,
  updateChildVisibility,
  setDownlaodStart,
  setDownloadEnd,
  setOrderTrue,
  setOrderFalse,
  addQuestionaire,
  reverseVisibility,
} = riskCheckSlice.actions;

export const riskCheckReducer = riskCheckSlice.reducer;
