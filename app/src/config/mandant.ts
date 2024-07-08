const mandant: InsuranceConfigs = {
  levelnine: {
    allowRattings: true,
    sendAttachments: {
      agent: true,
      client: true,
    },
    allowAgentInfoBox: true,
    maxPerson: 0,
    minPrice: null,
    allowedAgentNumbers: [],
    remarks: null,
    infoBoxOnStartpage: 'LevelnineInfoBoxComponent',
    dateComponentOnStartPage: null, // SDKBeginDateSelection
    logo: {
      size: '20',
      position: 'left',
    },
    footer: {
      companyText: '© 2024 ObjectiveIT GmbH',
      imprint: 'https://www.levelnine.de/impressum',
      dataprotection: 'https://www.levelnine.de/datenschutz',
    },
    agentNumberValidation: {
      validation: null,
      validation2: null,
      errorMessage: null,
      errorMessage2: null,
    },
    customTemplate: {
      client: 'insurances-online-customer-confirmation-DEFAULT',
      agent: 'insurances-online-agent-confirmation-LEVELNINE_TEST',
    },
    exclusiveSelectionPerCategory: false,
  },
  hallesche: {
    allowedAgentNumbers: [],
    allowRattings: true,
    sendAttachments: {
      agent: false,
      client: false,
    },
    allowAgentInfoBox: true,
    maxPerson: 0,
    minPrice: null,
    remarks: null,
    infoBoxOnStartpage: null,
    dateComponentOnStartPage: null,
    logo: {
      size: '50',
      position: 'center',
    },
    footer: {
      companyText: '© 2024 Hallesche - ALH Gruppe, hosted by ObjectiveIT GmbH',
      imprint: 'https://www.hallesche.de/impressum',
      dataprotection: 'https://www.hallesche.de/datenschutz',
    },
    agentNumberValidation: {
      validation: null,
      validation2: null,
      errorMessage: null,
      errorMessage2: null,
    },
    exclusiveSelectionPerCategory: false,
  },
  sdk: {
    allowRattings: false,
    sendAttachments: {
      agent: false,
      client: false,
    },
    allowAgentInfoBox: true,
    maxPerson: 1,
    minPrice: null,
    remarks: null,
    infoBoxOnStartpage: null,
    dateComponentOnStartPage: 'SDKBeginDateSelection',
    logo: {
      size: '20',
      position: 'left',
    },
    footer: {
      companyText:
        '© 2024 Süddeutsche Krankenversicherung a. G., hosted by ObjectiveIT GmbH',
      imprint: 'https://www.sdk.de/impressum/',
      dataprotection: 'https://www.sdk.de/datenschutz/',
    },
    allowedAgentNumbers: [],
    agentNumberValidation: {
      validation: null,
      validation2: null,
      errorMessage: null,
      errorMessage2: null,
    },
    customTemplate: {
      client: 'insurances-online-customer-confirmation-SDK',
      agent: 'insurances-online-agent-confirmation-SDK',
    },
    exclusiveSelectionPerCategory: true,
  },
  vmk: {
    allowRattings: true,
    sendAttachments: {
      agent: true,
      client: true,
    },
    allowAgentInfoBox: true,
    allowedAgentNumbers: [],
    maxPerson: 0,
    minPrice: 5.0,
    remarks: null,
    infoBoxOnStartpage: null,
    dateComponentOnStartPage: null,
    logo: {
      size: '0',
      position: 'center',
    },
    footer: {
      companyText:
        '© 2024 Versicherungskammer Maklermanagement Kranken GmbH, hosted by ObjectiveIT GmbH',
      imprint:
        'https://www.versicherungskammer-makler.de/content/ueber-uns/impressum/',
      dataprotection:
        'https://www.versicherungskammer-makler.de/content/ueber-uns/datenschutz/',
    },
    agentNumberValidation: {
      validation: null,
      validation2: null,
      errorMessage: null,
      errorMessage2: null,
    },
    exclusiveSelectionPerCategory: false,
  },
};

export default mandant;
