interface Window {
  handleOpenFab?: () => void;
}

type ConfigState = {
  theme: any;
  mandant: '';
  customQuestions: Question[];
  customFields: Field[];
  customValues: any;
  answeredCustomQuestions: boolean;
  logo: {
    position: string;
    size: string;
  };
  agentId: string;
  agentData: AgentData;
};

interface InitialValues {
  agentNumber1: string;
  agentNumber2: string;
  tariffsType: string[];
  insurer: string[];
  tariffs: string[];
  firstName: string;
  lastName: string;
  company: string;
  street: string;
  city: string;
  email: string;
  mobile: string;
  zipcode: string;
  landlineNumber: string;
  remarks: string;

  [key: string]: string | number | string[] | undefined;
}

type RatingValues = {
  premium: 5;
  comfort: 4;
  base: 3;
  none: 0;
};

type PredefineQuestion = {
  [key: string]: {
    insurerId: string;
    questionId: string;
    value: string | boolean;
  }[];
};

type StepperState = {
  steps: number;
};

type AgentData = {
  agentNumber1: string;
  agentNumber2?: string;
  firstName: string;
  lastName: string;
  company: string;
  street: string;
  city: string;
  zipcode: string;
  mobile: string;
  phone: string;
  email: string;
};

type KeyValue = {
  [key: string]: string;
};

type RiskCheckBody = {
  agentData: {
    agentid: string;
    agentNumber1: string;
    agentNumber2: string;
    company: string;
    city: string;
    zipcode: string;
    mobile: string;
    phone: string;
    email: string;
  };
  tariffPk: string;
  startdate: string;
  gender: number;
  birthday: string;
  occupationGroup: number;
  maintariffType: string;
  customerId: string;
  values: KeyValue;
  riskCheckId?: string;
};

type RiskCheckThunkProps = {
  Id: string;
  values: any;
  riskIdx: number;
  personIdx: number;
};

type InsuranceOccupationProps = {
  Id: string;
  input: string;
};

type TariffIdProps = {
  tariffId: string;
};

type RiskCheckIdProps = {
  riskCheckId: string;
  tariffId: string;
  riskCheckData: RiskCheckData;
};

type DownloadDoc = {
  content: string;
  displayName: string;
  documentId: string;
  documentType: string;
  fileType: string;
  tariffDocumentType: string;
};

type ContributionOption = {
  id: string;
  displayString: string;
  fee: number;
  symbol: string;
  insuranceName: string;
  insuranceId: string;
  descriptions: {};
  selected: boolean;
  tarrifId: string;
  tariffType: string;
};

interface SubmitEventData {
  tariffDisplayString: string;
  insurer: string;
}

interface RiskCheckData {
  riskCheckId: string;
  email: string;
  name: string;
  tariff: string;
  tariffId: string;
  price: number;
  insranceName: string;
  documentQuestions: string[] | [];
  applicationNumber?: string;
  benefitExclusion?: string | null;
  additionalFee?: string | null;
  additionalFeeReason?: string | null;
  differentFee?: string | null;

  formatedPrice?: string;
}

type RiskCheckOption = {
  id: string;
  questionnaireStep: number;
  questionnaireStepTotal: number;
  option: ContributionOptionExclusive;
  loading: boolean;
  moreQuestions: boolean;
  questionnaire?: Questionnaire;
};

type ContributionState = {
  error: string | undefined;
  isTariffClicked: boolean;
  pending: boolean;
  totalAmount: number;
  amount: number;
  commencementDate: string;
  personCount: number;
  personsId: string[];
  personState: boolean[];
  persons: InsuredPerson[];
};

type RiskCheckState = {
  occupations: string[];
  selectedInsurences: {
    [key: string]: {
      riskCheckOptions: RiskCheckOption[];
      previousQuestionaire: {
        eMail: string;
        [key: string]: any;
      };
      riskCheckIdx: number;
      openNotice: boolean;
    };
  };
  orderStatus: boolean;
  order: string;
  documents: DownloadDoc[];
  isDownloading: boolean;
};

type DeeplinState = {
  insurers: InsurerType[];
  tariffs: TariffType[];
};

type InsurerType = {
  id: number;
  value: string;
};

type TariffType = {
  id: string;
  value: string;
};

type InsuredPerson = {
  Id: string;
  birthdate: string;
  firstName: string;
  lastName: string;
  gender: string;
  total: number;
  res: ContributionCategory[];
  loading: boolean;
  title: string;
  ratings: { [key: string]: any };
};

type ContributionCategory = {
  title: string;
  total: number;
  options: ContributionOption[];
};

type BenefitExclusive = {
  orderAcceptedBenefitExclusion: string | null;
  orderAcceptedAdditionalFeeReason: string | null;
  orderAcceptedAdditionalFee: string | null;
  orderAcceptedDifferentFee: string | null;
};

type ContributionOptionExclusive = {
  id: string;
  displayString: string;
  fee: number;
  insuranceName: string;
  symbol: string;
  insuranceId: string;
  descriptions: {};
  selected: boolean;
  tarrifId: string;
  orderAcceptedStep: number;
  tariffType: string;
  blocksNextStep: boolean;
  orderAcceptedBenefitExclusion: string | null;
  orderAcceptedAdditionalFeeReason: string | null;
  orderAcceptedAdditionalFee: string | null;
  orderAcceptedDifferentFee: string | null;
};

type Questionnaire = {
  questionaryValues: QuestionaryValue[];
  questions: Question[];
  riskCheckId: string;
  riskCheckStatus: string;
  referenceId: string;
  documents: DownloadDoc[];
  loading: boolean;
};

type QuestionaryValue = {
  key: string;
  value: string;
  questionaireStep: number;
};

type CustomQuestions = {
  [key: string]: {
    avoidAdvice: AvoidAdvice;
  }[];
};

type Question = {
  key: string;
  questionaireStep: number;
  predefine: boolean;
  optional: boolean;
  readonly: boolean;
  computed: boolean;
  visible: boolean;
  expComputation?: string;
  html: boolean;
  text: string;
  helpText?: string;
  answer: Answer;
  expChildCheckPositive: boolean;
  maxValue: number;
  minValue: number;
  expChild: string;
  flatQuestions: any;
  childQuestionary: any;
};

type Field = {
  id: string;
  label: string;
  type: 'String' | 'Number' | 'Boolean' | 'Date' | 'Array';
  mandatory: boolean;
  backendField: string;
};

type Answer = {
  type: string;
  orientation: string;
  errorMsg?: string;
  picks?: AnswerPicks[];
  value?: string;
  alreadyAnswered: boolean;
  expValidation?: string;
  prefilled: boolean;
};

type AnswerPicks = {
  id: string;
  name: string;
};

type Validation = {
  type:
    | 'required'
    | 'isEmail'
    | 'minLength'
    | 'isTrue'
    | 'equals'
    | 'match'
    | 'customIBANValidation';
  value?: string | number | boolean;
  message: string;
};

interface Logo {
  size: string;
  position: 'left' | 'right' | 'center';
}

interface Footer {
  companyText: string;
  imprint: string;
  dataprotection: string;
}

interface AgentNumberValidation {
  validation: string | null;
  validation2: string | null;
  errorMessage: string | null;
  errorMessage2: string | null;
}

interface Palette {
  mode: string;
  primary: {
    main: string;
    dark: string;
    contrastText: string;
  };
  secondary: {
    main: string;
    dark: string;
  };
  text: {
    primary: string;
    dark: string;
  };
  customInfoIconColor?: {
    main: string;
    text: string;
    textPersonHeader: string;
  };
}

interface Theme {
  palette: Palette;
  typography: {
    fontFamily: string;
  };
}

interface InsuranceConfig {
  allowRattings: boolean;
  sendAttachments: { agent: boolean; client: boolean };
  allowAgentInfoBox: boolean;
  maxPerson: number;
  allowedAgentNumbers: string[];
  remarks: string | null;
  logo: Logo;
  footer: Footer;
  infoBoxOnStartpage: string | null;
  dateComponentOnStartPage: string | null;
  agentNumberValidation: AgentNumberValidation;
  customTemplate?: {
    client?: string;
    agent?: string;
  };
  exclusiveSelectionPerCategory: boolean;
  minPrice: number | null;
}

interface InsuranceConfigs {
  [key: string]: InsuranceConfig;
}

interface SpecialHint {
  insurerId: string;
  tariffType: string;
  tariffId: string | null;
  specialHint: string;
  blocksNextStep: boolean;
}

type Mandant = 'sdk' | 'levelnine' | 'hallesche' | 'vmk';
