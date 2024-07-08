import * as Yup from 'yup';
import { isValidIBANNumber } from '.';

const generateValidations = (
  typeValue: 'string' | 'boolean',
  validations: Validation[]
) => {
  let schema = Yup[typeValue ? typeValue : 'string']();

  for (const rule of validations) {
    switch (rule.type) {
      case 'isTrue':
        schema = (schema as Yup.BooleanSchema).oneOf([true], rule.message);
        break;
      case 'isEmail':
        schema = (schema as Yup.StringSchema).email(rule.message);
        break;
      case 'minLength':
        schema = (schema as Yup.StringSchema).min(
          rule.value as number,
          rule.message
        );
        break;
      case 'match':
        schema = (schema as Yup.StringSchema).matches(
          new RegExp(rule.value?.toString() ?? ''),
          rule.message
        );
        break;
      case 'equals':
        schema = (schema as Yup.StringSchema).oneOf(
          [rule.value?.toString()],
          rule.message
        );
        break;
      case 'customIBANValidation':
        schema = (schema as Yup.StringSchema).test(
          'customIBANValidation',
          rule.message,
          (value: string | undefined) => {
            if (value) {
              return isValidIBANNumber(value);
            }
            return true;
          }
        );
        break;
      default:
        schema = schema.required(rule.message);
        break;
    }
  }
  return schema;
};

export const getInputs = (
  questionnaire: Questionnaire,
  questionnaireStep: number,
  questionnaireStepTotal: number,
  all?: boolean
) => {
  let initialValues: { [key: string]: any } = {};
  let validationsFields: { [key: string]: any } = {};

  const generateFlatFields = (questions: Question[]) => {
    questions?.forEach((q) => {
      if (q.visible) {
        const validations: Validation[] = [];
        let typeValue: 'string' | 'boolean' = 'string';
        if (!q.optional) {
          validations.push({
            type: 'required',
            message: q.answer.errorMsg ?? 'Eingabe erforderlich.',
          });
        }
        if (q.computed && validations.length > 0) {
          validations.pop();
        }
        if (q.answer.type === 'Radio' && q.answer.picks?.length === 1) {
          validations.push({
            type: 'equals',
            message: q.answer.errorMsg ?? 'Eingabe erforderlich.',
            value: q.answer.picks[0].id,
          });
        }
        if (q.answer.expValidation) {
          validations.push({
            type: 'match',
            message: q.answer.errorMsg ?? 'Falsches format.',
            value: q.answer.expValidation,
          });
        }
        const initialValue = q.answer.value ?? '';
        if (q.answer.type !== 'Label') {
          const key = `${q.key.replace(/\./g, '&').replace(/\[\]/g, '$')}`;
          initialValues[key] = initialValue;
          if (q.key === 'orderIban') {
            validations.push({
              type: 'customIBANValidation',
              message: 'Ungültiges IBAN-Format.',
            });
          }
          validationsFields[key] = generateValidations(typeValue, validations);
        }
        if (q.childQuestionary) {
          q?.childQuestionary.forEach((child: any) => {
            generateFlatFields(child?.questions);
          });
        }
      }
    });
  };

  let questions;
  if (questionnaireStepTotal > questionnaireStep) {
    questions = questionnaire.questions.filter(
      (q) => q.questionaireStep === questionnaireStep
    );
  } else {
    questions = all
      ? questionnaire.questions
      : questionnaire.questions.filter((q) => !q.answer.alreadyAnswered);
  }
  generateFlatFields(questions);
  return {
    validationSchema: Yup.object({ ...validationsFields }),
    initialValues,
    questions,
  };
};

export const getComputedValues = (questions: Question[], values: KeyValue) => {
  const computeQuestions = questions.filter((q) => q.computed);
  const computed: KeyValue = {};
  const regex = /(\d+)|(\${.*?})|([+-])/g;
  computeQuestions.forEach((q) => {
    if (q.expComputation) {
      let arr = q.expComputation
        .split(regex)
        .filter((v) => v !== undefined && v !== '');
      let result = 0;
      let last = '';
      for (let i = 0; i < arr.length; i++) {
        let value = '';
        let answer = 0;
        let curr = arr[i];

        if (curr.startsWith('${')) {
          curr = curr.substring(2, curr.length - 1);
          value = values[curr];
          if (['ja', 'yes', 'true'].some((i) => i === value.toLowerCase())) {
            answer = 1;
          }
        } else {
          answer = Number(curr);
        }
        if (i === 0) {
          result = answer;
        } else if (curr === '+' || curr === '-') {
          last = curr;
        } else if (last === '+') {
          result += answer;
        } else {
          result -= answer;
        }
        if (value === '' && result === 0) {
          computed[curr] = 'false';
        }
      }
      computed[q.key] = result.toString();
    }
  });
  return computed;
};
