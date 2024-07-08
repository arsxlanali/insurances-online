import { showSuccess, showError } from './toast';

export function base64ToUtf8(base64String: string): string {
  const binaryString: string = atob(base64String);
  try {
    const utf8String: string = decodeURIComponent(escape(binaryString));
    return utf8String;
  } catch {
    return binaryString;
  }
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function getTextColor(mandant: string): string {
  const textColor = mandant === 'gothaer' ? 'green' : 'primary.contrastText';
  if (mandant === 'sdk' || mandant === 'levelnine') {
    return 'white';
  }
  return textColor;
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function findHints(
  specialHint: SpecialHint[],
  insuranceRisk: RiskCheckOption
): SpecialHint[] {
  return specialHint.filter(
    (hint) =>
      hint.tariffType.toString() === insuranceRisk.option.tariffType &&
      hint.insurerId === insuranceRisk.option.insuranceId.toString() &&
      (hint.tariffId === null ||
        hint.tariffId.toString() === insuranceRisk.option.tarrifId)
  );
}

export function hexToRgba(hex: string, opacity: number): string {
  hex = hex.replace('#', '');
  const red = parseInt(hex.substring(0, 2), 16);
  const green = parseInt(hex.substring(2, 4), 16);
  const blue = parseInt(hex.substring(4, 6), 16);
  return `rgb(${red}, ${green}, ${blue}, ${opacity})`;
}

export function getFilteredPredefine(
  predefineQuestion: PredefineQuestion,
  mandnat: string,
  insuranceId: string
) {
  if (predefineQuestion[mandnat]) {
    return (
      predefineQuestion[mandnat]
        // eslint-disable-next-line
        .filter((question) => question.insurerId == insuranceId)
        .map((q) => ({ [q.questionId]: q.value }))
        .reduce((result, currentObject) => {
          return { ...result, ...currentObject };
        }, {})
    );
  }
  return {};
}

export function getOptionValuesByKeys(
  array: QuestionaryValue[],
  option: ContributionOptionExclusive,
  questionaireStep: number,
  questionnaireStepTotal: number
): ContributionOptionExclusive {
  const foundValues: BenefitExclusive = {
    orderAcceptedBenefitExclusion: null,
    orderAcceptedAdditionalFeeReason: null,
    orderAcceptedAdditionalFee: null,
    orderAcceptedDifferentFee: null,
  };

  if (
    questionaireStep < questionnaireStepTotal &&
    questionaireStep <= option.orderAcceptedStep
  ) {
    let flag = false;
    array.forEach((obj: QuestionaryValue) => {
      if (foundValues.hasOwnProperty(obj.key)) {
        flag = true;
        option[obj.key as keyof BenefitExclusive] = obj.value;
        option.orderAcceptedStep = questionaireStep;
      }
    });
    if (!flag) {
      option = { ...option, ...foundValues };
    }
  } else {
    array.forEach((obj: QuestionaryValue) => {
      if (
        foundValues.hasOwnProperty(obj.key) &&
        option[obj.key as keyof ContributionOptionExclusive] === null
      ) {
        option[obj.key as keyof BenefitExclusive] = obj.value;
        option.orderAcceptedStep = questionaireStep;
      }
    });
  }

  return option;
}

export function extractDocumentId(str: string): string | null {
  const firstCaseMatches = str.match(/downloadLnDocument_(.+)/);
  const secondCaseMatches = str.match(/lnTaaDownloadDocuments_(.+)/);
  if (firstCaseMatches) {
    return String(firstCaseMatches[1]);
  } else if (secondCaseMatches) {
    return String(secondCaseMatches[1]);
  }
  return null;
}

export function getDocumentById(
  id: string | null,
  documents: DownloadDoc[]
): DownloadDoc | undefined {
  if (!id) {
    return undefined;
  }
  return documents.find((doc) => doc.documentId === id);
}

export function downloadDocument(
  base64String: string | undefined,
  fileName: string
) {
  if (base64String) {
    const link = window.document.createElement('a');
    link.href = 'data:application/octet-stream;base64,' + base64String;
    link.download = fileName;
    link.style.display = 'none';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    showSuccess('Dokument wird heruntergeladen');
  } else {
    showError('Das Herunterladen des Dokuments ist fehlgeschlagen');
  }
}

export function getQueryParams() {
  return new URLSearchParams(window.location.search);
}

interface CodeLengths {
  [key: string]: number;
}

export function isValidIBANNumber(input: string): boolean {
  const CODE_LENGTHS: CodeLengths = {
    AD: 24,
    AE: 23,
    AT: 20,
    AZ: 28,
    BA: 20,
    BE: 16,
    BG: 22,
    BH: 22,
    BR: 29,
    CH: 21,
    CR: 21,
    CY: 28,
    CZ: 24,
    DE: 22,
    DK: 18,
    DO: 28,
    EE: 20,
    ES: 24,
    FI: 18,
    FO: 18,
    FR: 27,
    GB: 22,
    GI: 23,
    GL: 18,
    GR: 27,
    GT: 28,
    HR: 21,
    HU: 28,
    IE: 22,
    IL: 23,
    IS: 26,
    IT: 27,
    JO: 30,
    KW: 30,
    KZ: 20,
    LB: 28,
    LI: 21,
    LT: 20,
    LU: 20,
    LV: 21,
    MC: 27,
    MD: 24,
    ME: 22,
    MK: 19,
    MR: 27,
    MT: 31,
    MU: 30,
    NL: 18,
    NO: 15,
    PK: 24,
    PL: 28,
    PS: 29,
    PT: 25,
    QA: 29,
    RO: 24,
    RS: 22,
    SA: 24,
    SE: 24,
    SI: 19,
    SK: 24,
    SM: 27,
    TN: 24,
    TR: 26,
    AL: 28,
    BY: 28,
    // CR: 22,
    EG: 29,
    GE: 22,
    IQ: 23,
    LC: 32,
    SC: 31,
    ST: 25,
    SV: 28,
    TL: 23,
    UA: 29,
    VA: 22,
    VG: 24,
    XK: 20,
  };

  const iban = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/);
  let digits;

  if (!code || iban.length !== CODE_LENGTHS[code[1]]) {
    return false;
  }

  digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, (letter) =>
    String(letter.charCodeAt(0) - 55)
  );
  return mod97(digits) === 1;
}

function mod97(string: string): number {
  let checksum: number = parseInt(string.slice(0, 2), 10);
  let fragment: string;

  for (let offset = 2; offset < string.length; offset += 7) {
    fragment = String(checksum) + string.substring(offset, offset + 7);
    checksum = parseInt(fragment, 10) % 97;
  }
  return checksum;
}

export const deepCopy = (object: Object) => {
  return JSON.parse(JSON.stringify(object));
};

export * from './getInputs';
