export interface TokenData {
  token: string | null;
  timestamp: number;
}

interface Reducer {
  contribution: ContributionState;
  stepper: StepperState;
  tokenData: TokenData;
}
export const mocdata: Reducer = {
  contribution: {
    error: 'ffds',
    pending: false,
    isTariffClicked: false,
    commencementDate: '2023-02-27',
    personCount: 1,
    totalAmount: 0,
    personsId: ['3a7995b615f84517'],
    personState: [true],
    amount: 0,
    persons: [
      {
        Id: '3a7995b615f84517',
        total: 100,
        birthdate: '2023-02-16',
        gender: 'MALE',
        loading: false,
        firstName: 'Fahad',
        lastName: 'Tufail',
        title: '',
        ratings: [],
        res: [
          {
            title: 'Ambulant',
            total: 0,
            options: [
              {
                id: 'a7995b615f845175',
                displayString: 'VorsorgePRIVAT',
                symbol: 'GKK',
                fee: 8.8,
                insuranceName: 'Abc',
                insuranceId: '0',
                descriptions: {
                  VorsorgePRIVAT:
                    'Ambulanter Zusatztarif für GKV-Versicherte:\n\n- ambulante ärztliche Vorsorgeuntersuchungen: bis 500 EUR p. a. (begrenztere Erstattung in den ersten beiden Kalenderjahren (KJ))\n- Schutzimpfungen (auch Reiseschutzimpfungen und Malariaprophylaxe): bis 300 EUR in zwei KJ\n- Brillen, Kontaktlinsen: 80% bis 400 EUR in zwei KJ \n- Refraktive Chirurgien (z. B. LASIK): bis 1.500 EUR während gesamter Vertragslaufzeit (1. KJ - max. 200 EUR, ersten zwei KJ - max. 500 EUR)\n- Hörhilfen einschl. Otoplastik: 80% bis zu einem nach GKV-Vorleistung verbleibenden Rechnungsbetrag von 1.000 EUR in fünf Kalenderjahren\n\n2 Gesundheitsfragen im Antrag:\n- bei "Sehschwäche": Beitragsaufschlag von 4 EUR, wenn eine Sehhilfe getragen wird/erforderlich ist \n- bei "Schwerhörigkeit oder Gehörlosigkeit": Leistungsausschluss für Hörhilfen\n\n\nTarif ohne Alterungsrückstellungen\n\n',
                },
                selected: false,
                tarrifId: 'ABCD#',
                tariffType: 'Zahn',
              },
              {
                id: '7995b615f845175d',
                displayString: 'NaturPRIVAT',
                fee: 9.89,
                symbol: 'GKK',
                insuranceName: 'Abc',
                insuranceId: '0',

                descriptions: {
                  NaturPRIVAT:
                    'Ambulanter Zusatztarif für GKV-Versicherte:\n\n80% für naturheilk./altern. Heilmethoden durch Heilpraktiker/Ärzte (incl. Hufeland) bis 1.000,- p. a. (begrenztere Erstattung in den 1. beiden KJ)\n\nTarif ohne Alterungsrückstellungen\n\nAb Beginn des KJ, in dem das 20., 50. bzw. 65. Lebensjahr vollendet, ist der Beitrag für das Eintrittsalter 20, 50 bzw. 65 zu zahlen.',
                },
                selected: false,
                tarrifId: 'ABCD#',
                tariffType: 'Zahn',
              },
              {
                id: '995b615f845175dc',
                displayString: 'NaturPRIVAT VorsorgePRIVAT',
                fee: 18.69,
                symbol: 'GKK',
                insuranceName: 'Abc',
                insuranceId: '0',

                descriptions: {
                  NaturPRIVAT:
                    'Ambulanter Zusatztarif für GKV-Versicherte:\n\n80% für naturheilk./altern. Heilmethoden durch Heilpraktiker/Ärzte (incl. Hufeland) bis 1.000,- p. a. (begrenztere Erstattung in den 1. beiden KJ)\n\nTarif ohne Alterungsrückstellungen\n\nAb Beginn des KJ, in dem das 20., 50. bzw. 65. Lebensjahr vollendet, ist der Beitrag für das Eintrittsalter 20, 50 bzw. 65 zu zahlen.',
                  VorsorgePRIVAT:
                    'Ambulanter Zusatztarif für GKV-Versicherte:\n\n- ambulante ärztliche Vorsorgeuntersuchungen: bis 500 EUR p. a. (begrenztere Erstattung in den ersten beiden Kalenderjahren (KJ))\n- Schutzimpfungen (auch Reiseschutzimpfungen und Malariaprophylaxe): bis 300 EUR in zwei KJ\n- Brillen, Kontaktlinsen: 80% bis 400 EUR in zwei KJ \n- Refraktive Chirurgien (z. B. LASIK): bis 1.500 EUR während gesamter Vertragslaufzeit (1. KJ - max. 200 EUR, ersten zwei KJ - max. 500 EUR)\n- Hörhilfen einschl. Otoplastik: 80% bis zu einem nach GKV-Vorleistung verbleibenden Rechnungsbetrag von 1.000 EUR in fünf Kalenderjahren\n\n2 Gesundheitsfragen im Antrag:\n- bei "Sehschwäche": Beitragsaufschlag von 4 EUR, wenn eine Sehhilfe getragen wird/erforderlich ist \n- bei "Schwerhörigkeit oder Gehörlosigkeit": Leistungsausschluss für Hörhilfen\n\n\nTarif ohne Alterungsrückstellungen\n\n',
                },
                selected: false,
                tarrifId: 'ABCD#',
                tariffType: 'Zahn',
              },
              {
                id: '95b615f845175dcc',
                displayString: 'NaturPRIVAT VorsorgePRIVAT',
                fee: 18.69,
                symbol: 'GKK',
                insuranceName: 'Abc',
                insuranceId: '0',

                descriptions: {
                  NaturPRIVAT:
                    'Ambulanter Zusatztarif für GKV-Versicherte:\n\n80% für naturheilk./altern. Heilmethoden durch Heilpraktiker/Ärzte (incl. Hufeland) bis 1.000,- p. a. (begrenztere Erstattung in den 1. beiden KJ)\n\nTarif ohne Alterungsrückstellungen\n\nAb Beginn des KJ, in dem das 20., 50. bzw. 65. Lebensjahr vollendet, ist der Beitrag für das Eintrittsalter 20, 50 bzw. 65 zu zahlen.',
                  VorsorgePRIVAT:
                    'Ambulanter Zusatztarif für GKV-Versicherte:\n\n- ambulante ärztliche Vorsorgeuntersuchungen: bis 500 EUR p. a. (begrenztere Erstattung in den ersten beiden Kalenderjahren (KJ))\n- Schutzimpfungen (auch Reiseschutzimpfungen und Malariaprophylaxe): bis 300 EUR in zwei KJ\n- Brillen, Kontaktlinsen: 80% bis 400 EUR in zwei KJ \n- Refraktive Chirurgien (z. B. LASIK): bis 1.500 EUR während gesamter Vertragslaufzeit (1. KJ - max. 200 EUR, ersten zwei KJ - max. 500 EUR)\n- Hörhilfen einschl. Otoplastik: 80% bis zu einem nach GKV-Vorleistung verbleibenden Rechnungsbetrag von 1.000 EUR in fünf Kalenderjahren\n\n2 Gesundheitsfragen im Antrag:\n- bei "Sehschwäche": Beitragsaufschlag von 4 EUR, wenn eine Sehhilfe getragen wird/erforderlich ist \n- bei "Schwerhörigkeit oder Gehörlosigkeit": Leistungsausschluss für Hörhilfen\n\n\nTarif ohne Alterungsrückstellungen\n\n',
                },
                selected: false,
                tarrifId: 'ABCD#',
                tariffType: 'Zahn',
              },
              {
                id: '5b615f845175dcc4',
                displayString: 'NaturPRIVAT',
                fee: 9.89,
                symbol: 'GKK',

                insuranceName: 'Abc',
                insuranceId: '0',

                descriptions: {
                  NaturPRIVAT:
                    'Ambulanter Zusatztarif für GKV-Versicherte:\n\n80% für naturheilk./altern. Heilmethoden durch Heilpraktiker/Ärzte (incl. Hufeland) bis 1.000,- p. a. (begrenztere Erstattung in den 1. beiden KJ)\n\nTarif ohne Alterungsrückstellungen\n\nAb Beginn des KJ, in dem das 20., 50. bzw. 65. Lebensjahr vollendet, ist der Beitrag für das Eintrittsalter 20, 50 bzw. 65 zu zahlen.',
                },
                selected: false,
                tarrifId: 'ABCD#',
                tariffType: 'Zahn',
              },
              {
                id: 'b615f845175dcc44',
                displayString: 'VorsorgePRIVAT',
                fee: 8.8,
                symbol: 'GKK',
                insuranceName: 'Abc',
                insuranceId: '0',

                descriptions: {
                  VorsorgePRIVAT:
                    'Ambulanter Zusatztarif für GKV-Versicherte:\n\n- ambulante ärztliche Vorsorgeuntersuchungen: bis 500 EUR p. a. (begrenztere Erstattung in den ersten beiden Kalenderjahren (KJ))\n- Schutzimpfungen (auch Reiseschutzimpfungen und Malariaprophylaxe): bis 300 EUR in zwei KJ\n- Brillen, Kontaktlinsen: 80% bis 400 EUR in zwei KJ \n- Refraktive Chirurgien (z. B. LASIK): bis 1.500 EUR während gesamter Vertragslaufzeit (1. KJ - max. 200 EUR, ersten zwei KJ - max. 500 EUR)\n- Hörhilfen einschl. Otoplastik: 80% bis zu einem nach GKV-Vorleistung verbleibenden Rechnungsbetrag von 1.000 EUR in fünf Kalenderjahren\n\n2 Gesundheitsfragen im Antrag:\n- bei "Sehschwäche": Beitragsaufschlag von 4 EUR, wenn eine Sehhilfe getragen wird/erforderlich ist \n- bei "Schwerhörigkeit oder Gehörlosigkeit": Leistungsausschluss für Hörhilfen\n\n\nTarif ohne Alterungsrückstellungen\n\n',
                },
                selected: false,
                tarrifId: 'ABCD#',
                tariffType: 'Zahn',
              },
            ],
          },
          {
            title: 'Krankenhaus',
            total: 0,
            options: [
              {
                id: '615f845175dcc44f',
                displayString: 'KlinikPRIVAT Premium',
                fee: 5.55,
                symbol: 'GKK',
                insuranceName: 'Abc',
                insuranceId: '0',

                descriptions: {
                  KlinikPRIVAT_Premium:
                    'stationäre Zusatzversicherung für GKV-Versicherte\n\n- 1- und 2-Bettzimmer\n- privatärztliche Behandlung (einschl. Belegarzt), auch über GÖÄ-Höchstsätze hinaus\n- freie Krankenhauswahl\n- ambulante OP\n- ambulante Aufnahme- und Abschlussuntersuchungen\n- gesetzliche Zuzahlungen (zu stationären Aufenthalten und Fahrt-/Transportkosten)\n- Transporte, bis 250 EUR p. a.\n- Reha-Tagegeld (50 EUR, max. 28 Tage)\n- kosmetische OP, bis 10.000 EUR je Unfall\n- Rooming-In (bis Alter 15)\n\nTeil I, AVB/ZV_Stand: 01.07.2021, SAP-Nr.: 342744, 07.2021\nTeill II, Tarif KlinikPRIVAT Premium_Stand: 01.07.2021, SAP-Nr.: 342207, 07.2021',
                },
                selected: false,
                tarrifId: 'ABCD#',
                tariffType: 'Zahn',
              },
              {
                id: '15f845175dcc44f4',
                displayString: 'KlinikPRIVAT Option KlinikPRIVAT Unfall',
                fee: 7.11,
                symbol: 'GKK',
                insuranceName: 'Abc',
                insuranceId: '0',

                descriptions: {
                  KlinikPRIVAT_Option:
                    'Optionstarif für GKV-Versicherte \n\nOption auf Wechsel in Tarif KlinikPRIVAT Premium, zu bestimmten Anlässen/Zeitpunkten\n\nTarif auch alleine (bei einem Mindestbeitrag von 5 EUR) oder mit weiterer ZV abschließbar\nmax. EA: 49 (Tarif endet zum 01.01. des Jahres, in dem die VP 50 Jahre alt wird)\n\nTarif ohne Alterungsrückstellungen (altersunabhängiger Einheitsbeitrag)\n\nTeil I, AVB/ZV_Stand: 01.07.2021, SAP-Nr.: 342744, 07.2021\nTeill II, Tarif KlinikPRIVAT Option_Stand: 01.07.2021, SAP-Nr.: 342211, 07.2021',
                  KlinikPRIVAT_Unfall:
                    'stationäre Zusatzversicherung für GKV-Versicherte\n\nnur unfallbedingt:\n- 1- und 2-Bettzimmer\n- privatärztliche Behandlung (einschl. Belegarzt), auch über GÖÄ-Höchstsätze hinaus\n- freie Krankenhauswahl\n- ambulante OP\n- ambulante Aufnahme- und Abschlussuntersuchungen\n- gesetzliche Zuzahlungen (zu stationären Aufenthalten und Fahrt-/Transportkosten)\n- Reha-Tagegeld (50 EUR, max. 28 Tage)\n- kosmetische OP, bis 10.000 EUR je Unfall\n- Rooming-In (bis Alter 15)\n\nTarif ohne Alterungsrückstellungen\nplanmäßige Beitragserhöhung zum 1.1. des Kalenderjahres, in dem das 20., 40. bzw. 60. Lebensjahr vollendet wird\n\nTeil I, AVB/ZV_Stand: 01.07.2021, SAP-Nr.: 342744, 07.2021\nTeill II, Tarif KlinikPRIVAT Unfall_Stand: 01.07.2021, SAP-Nr.: 342209, 07.2021',
                },
                selected: false,
                tarrifId: 'ABCD#',
                tariffType: 'Zahn',
              },
              {
                id: '5f845175dcc44f44',
                displayString: 'KlinikPRIVAT Unfall',
                fee: 3.96,
                symbol: 'GKK',
                insuranceName: 'Abc',
                insuranceId: '0',

                descriptions: {
                  KlinikPRIVAT_Unfall:
                    'stationäre Zusatzversicherung für GKV-Versicherte\n\nnur unfallbedingt:\n- 1- und 2-Bettzimmer\n- privatärztliche Behandlung (einschl. Belegarzt), auch über GÖÄ-Höchstsätze hinaus\n- freie Krankenhauswahl\n- ambulante OP\n- ambulante Aufnahme- und Abschlussuntersuchungen\n- gesetzliche Zuzahlungen (zu stationären Aufenthalten und Fahrt-/Transportkosten)\n- Reha-Tagegeld (50 EUR, max. 28 Tage)\n- kosmetische OP, bis 10.000 EUR je Unfall\n- Rooming-In (bis Alter 15)\n\nTarif ohne Alterungsrückstellungen\nplanmäßige Beitragserhöhung zum 1.1. des Kalenderjahres, in dem das 20., 40. bzw. 60. Lebensjahr vollendet wird\n\nTeil I, AVB/ZV_Stand: 01.07.2021, SAP-Nr.: 342744, 07.2021\nTeill II, Tarif KlinikPRIVAT Unfall_Stand: 01.07.2021, SAP-Nr.: 342209, 07.2021',
                },
                selected: false,
                tarrifId: 'ABCD#',
                tariffType: 'Zahn',
              },
              {
                id: 'f845175dcc44f444',
                displayString: 'KlinikPRIVAT Premium',
                fee: 5.55,
                symbol: 'GKK',
                insuranceName: 'Abc',
                insuranceId: '0',

                descriptions: {
                  KlinikPRIVAT_Premium:
                    'stationäre Zusatzversicherung für GKV-Versicherte\n\n- 1- und 2-Bettzimmer\n- privatärztliche Behandlung (einschl. Belegarzt), auch über GÖÄ-Höchstsätze hinaus\n- freie Krankenhauswahl\n- ambulante OP\n- ambulante Aufnahme- und Abschlussuntersuchungen\n- gesetzliche Zuzahlungen (zu stationären Aufenthalten und Fahrt-/Transportkosten)\n- Transporte, bis 250 EUR p. a.\n- Reha-Tagegeld (50 EUR, max. 28 Tage)\n- kosmetische OP, bis 10.000 EUR je Unfall\n- Rooming-In (bis Alter 15)\n\nTeil I, AVB/ZV_Stand: 01.07.2021, SAP-Nr.: 342743, 07.2021\nTeill II, Tarif KlinikPRIVAT Premium_Stand: 01.07.2021, SAP-Nr.: 342205, 07.2021',
                },
                selected: false,
                tarrifId: 'ABCD#',
                tariffType: 'Zahn',
              },
              {
                id: '845175dcc44f4445',
                displayString: 'KlinikPRIVAT Unfall',
                fee: 3.96,
                symbol: 'GKK',
                insuranceName: 'Abc',
                insuranceId: '0',

                descriptions: {
                  KlinikPRIVAT_Unfall:
                    'stationäre Zusatzversicherung für GKV-Versicherte\n\nnur unfallbedingt:\n- 1- und 2-Bettzimmer\n- privatärztliche Behandlung (einschl. Belegarzt), auch über GÖÄ-Höchstsätze hinaus\n- freie Krankenhauswahl\n- ambulante OP\n- ambulante Aufnahme- und Abschlussuntersuchungen\n- gesetzliche Zuzahlungen (zu stationären Aufenthalten und Fahrt-/Transportkosten)\n- Reha-Tagegeld (50 EUR, max. 28 Tage)\n- kosmetische OP, bis 10.000 EUR je Unfall\n- Rooming-In (bis Alter 15)\n\nTarif ohne Alterungsrückstellungen\nplanmäßige Beitragserhöhung zum 1.1. des Kalenderjahres, in dem das 20., 40. bzw. 60. Lebensjahr vollendet wird\n\nTeil I, AVB/ZV_Stand: 01.07.2021, SAP-Nr.: 342743, 07.2021\nTeill II, Tarif KlinikPRIVAT Unfall_Stand: 01.07.2021, SAP-Nr.: 342208, 07.2021',
                },
                selected: false,
                tarrifId: 'ABCD#',
                tariffType: 'Zahn',
              },
              {
                id: '45175dcc44f44455',
                displayString: 'KlinikPRIVAT Option KlinikPRIVAT Unfall',
                fee: 7.11,
                symbol: 'GKK',
                insuranceName: 'Abc',
                insuranceId: '0',

                descriptions: {
                  KlinikPRIVAT_Option:
                    'Optionstarif für GKV-Versicherte \n\nOption auf Wechsel in Tarif KlinikPRIVAT Premium, zu bestimmten Anlässen/Zeitpunkten\n\nTarif auch alleine (bei einem Mindestbeitrag von 5 EUR) oder mit weiterer ZV abschließbar\nmax. EA: 49 (Tarif endet zum 01.01. des Jahres, in dem die VP 50 Jahre alt wird)\n\nTarif ohne Alterungsrückstellungen (altersunabhängiger Einheitsbeitrag)\n\nTeil I, AVB/ZV_Stand: 01.07.2021, SAP-Nr.: 342743, 07.2021\nTeill II, Tarif KlinikPRIVAT Option_Stand: 01.07.2021, SAP-Nr.: 342210, 07.2021',
                  KlinikPRIVAT_Unfall:
                    'stationäre Zusatzversicherung für GKV-Versicherte\n\nnur unfallbedingt:\n- 1- und 2-Bettzimmer\n- privatärztliche Behandlung (einschl. Belegarzt), auch über GÖÄ-Höchstsätze hinaus\n- freie Krankenhauswahl\n- ambulante OP\n- ambulante Aufnahme- und Abschlussuntersuchungen\n- gesetzliche Zuzahlungen (zu stationären Aufenthalten und Fahrt-/Transportkosten)\n- Reha-Tagegeld (50 EUR, max. 28 Tage)\n- kosmetische OP, bis 10.000 EUR je Unfall\n- Rooming-In (bis Alter 15)\n\nTarif ohne Alterungsrückstellungen\nplanmäßige Beitragserhöhung zum 1.1. des Kalenderjahres, in dem das 20., 40. bzw. 60. Lebensjahr vollendet wird\n\nTeil I, AVB/ZV_Stand: 01.07.2021, SAP-Nr.: 342743, 07.2021\nTeill II, Tarif KlinikPRIVAT Unfall_Stand: 01.07.2021, SAP-Nr.: 342208, 07.2021',
                },
                selected: false,
                tarrifId: 'ABCD#',
                tariffType: 'Zahn',
              },
            ],
          },
          {
            title: 'Zahn',
            total: 0,
            options: [
              {
                id: '5175dcc44f444554',
                displayString: 'ZahnPRIVAT Optimal',
                fee: 1.92,
                symbol: 'GKK',
                insuranceName: 'Abc',
                insuranceId: '0',

                descriptions: {
                  'ZahnPRIVAT Optimal':
                    'Zusatzversicherung für GKV-Versicherte:\n\n- Zahnersatz, inkl. Implantate und Inlays, Zahnbehandlung (inkl. Maßnahmen zur Schmerzausschaltung): 70% der Restkosten\n- Regelversorgung: 100% inkl. GKV\n- Zahnprophylaxe: 84 EUR p. a.\n\nTarif ohne  Alterungsrückstellungen (Altersgruppen: 0-19, 20-29, 30-39, 40-49, 50-59 und ab 60)  ',
                },
                selected: false,
                tarrifId: 'ABCD#',
                tariffType: 'Zahn',
              },
              {
                id: '175dcc44f4445547',
                displayString: 'ZahnPRIVAT Premium',
                fee: 19.79,
                symbol: 'GKK',
                insuranceName: 'Abc',
                insuranceId: '0',

                descriptions: {
                  'ZahnPRIVAT Premium':
                    'Zusatzversicherung für GKV-Versicherte:\n\n- Zahnersatz, inkl. Implantate und Inlays, Zahnbehandlung (inkl. Maßnahmen zur Schmerzausschaltung): 90% der Restkosten\n- Regelversorgung: 100% inkl. GKV\n- Zahnprophylaxe: 108 EUR p. a.\n- KFO: max. 3.600 EUR Gesamtleistung (KIG 1-5), bis Alter 18 (ab Alter 18 nur bei Unfall)\n\nTarif ohne  Alterungsrückstellungen (Altersgruppen: 0-19, 20-29, 30-39, 40-49, 50-59 und ab 60)  ',
                },
                selected: false,
                tarrifId: 'ABCD#',
                tariffType: 'Zahn',
              },
              {
                id: '75dcc44f4445547e',
                displayString: 'ZahnPRIVAT Kompakt',
                fee: 1.4,
                symbol: 'GKK',
                insuranceName: 'Abc',
                insuranceId: '0',

                descriptions: {
                  'ZahnPRIVAT Kompakt':
                    'Zusatzversicherung für GKV-Versicherte:\n\n- Zahnersatz, inkl. Implantate und Inlays, Zahnbehandlung (inkl. Maßnahmen zur Schmerzausschaltung): 50% der Restkosten\n- Regelversorgung: 100% inkl. GKV\n- Zahnprophylaxe: 60 EUR p. a.\n\nTarif ohne  Alterungsrückstellungen (Altersgruppen: 0-19, 20-29, 30-39, 40-49, 50-59 und ab 60)  ',
                },
                selected: false,
                tarrifId: 'ABCD#',
                tariffType: 'Zahn',
              },
              {
                id: '5dcc44f4445547ee',
                displayString: 'ZahnPRIVAT Optimal',
                fee: 1.92,
                symbol: 'GKK',
                insuranceName: 'Abc',
                insuranceId: '0',

                descriptions: {
                  'ZahnPRIVAT Optimal':
                    'Zusatzversicherung für GKV-Versicherte:\n\n- Zahnersatz, incl. Implantate und Inlays, Zahnbehandlung (inkl. Maßnahmen zur Schmerzausschaltung): 70% der Restkosten\n- Regelversorgung: 100% inkl. GKV\n- Zahnprophylaxe: 84 EUR p. a.\n\nTarif ohne  Alterungsrückstellungen (Altersgruppen: 0-19, 20-29, 30-39, 40-49, 50-59 und ab 60)  ',
                },
                selected: false,
                tarrifId: 'ABCD#',
                tariffType: 'Zahn',
              },
              {
                id: 'dcc44f4445547ee5',
                displayString: 'ZahnPRIVAT Premium',
                fee: 19.79,
                symbol: 'GKK',
                insuranceName: 'Abc',
                insuranceId: '0',

                descriptions: {
                  'ZahnPRIVAT Premium':
                    'Zusatzversicherung für GKV-Versicherte:\n\n- Zahnersatz, inkl. Implantate und Inlays, Zahnbehandlung (inkl. Maßnahmen zur Schmerzausschaltung): 90% der Restkosten\n- Regelversorgung: 100% inkl. GKV\n- Zahnprophylaxe: 108 EUR p. a.\n- KFO: max. 3.600 EUR Gesamtleistung (KIG 1-5), bis Alter 18 (ab Alter 18 nur bei Unfall)\n\nTarif ohne  Alterungsrückstellungen (Altersgruppen: 0-19, 20-29, 30-39, 40-49, 50-59 und ab 60)  ',
                },
                selected: false,
                tarrifId: 'ABCD#',
                tariffType: 'Zahn',
              },
              {
                id: 'cc44f4445547ee57',
                displayString: 'ZahnPRIVAT Kompakt',
                fee: 1.4,
                symbol: 'GKK',
                insuranceName: 'Abc',
                insuranceId: '0',

                descriptions: {
                  'ZahnPRIVAT Kompakt':
                    'Zusatzversicherung für GKV-Versicherte:\n\n- Zahnersatz, inkl. Implantate und Inlays, Zahnbehandlung (inkl. Maßnahmen zur Schmerzausschaltung): 50% der Restkosten\n- Regelversorgung: 100% inkl. GKV\n- Zahnprophylaxe: 60 EUR p. a.\n\nTarif ohne  Alterungsrückstellungen (Altersgruppen: 0-19, 20-29, 30-39, 40-49, 50-59 und ab 60)  ',
                },
                selected: false,
                tarrifId: 'ABCD#',
                tariffType: 'Zahn',
              },
            ],
          },
        ],
      },
    ],
  },
  tokenData: {
    token:
      'eyJraWQiOiJqd2tfbGV2ZWxuaW5lIiwiYWxnIjoiUlMyNTYifQ.eyJqdGkiOiI5MTZiZDNjMDBhMmEwMzMzNjYxMzQ2ODhhYWZhOTEzYSIsImlzcyI6IkxldmVsbmluZSBXZWJzZXJ2aWNlIiwiaWF0IjoxNjc3NDc3MDA4LCJuYmYiOjE2Nzc0NzY4ODgsImV4cCI6MTY3NzQ3NzkwOCwicm9sZXMiOlsiY2FsY19oaSIsInJ3X2FnZW50IiwicndfY3VzdG9tZXIiLCJyd19hbmFseXNlIl0sInN1YiI6InZtayM5MTZiZDNjMDBhMmEwMzMzNjYxMzQ2ODhhYWZhOTEzYSIsImF1ZCI6IkxldmVsbmluZSBFeHRlcm5hbCBBcHAiLCJzeXN0ZW11c2VyIjoidm1rIiwic3lzdGVtc2Vzc2lvbiI6IjkxNmJkM2MwMGEyYTAzMzM2NjEzNDY4OGFhZmE5MTNhIiwic3lzdGVtaWQiOiIxMDA1IiwicHJpbmNpcGFsSWQiOiIxMDA1In0.BZhcEVN0k2lbVkTMs4AQwyPttP8jxyYGNSEjfTvJnP5MZxESW7JkUcoMw8omGFXQeMcq8fGs1te63-8scr9VK1_8Y8COrsno_jSgJx31Tj17A5IpbrxHa9-_W-wKMzVRmEVZxWRmzET1aWT0Z0LR3vBpKVWf1ZJN7kXwf-qIg0ibex1HQSsoJNoPGo-kj3dIVnz1bS-ShXnx1ZYzYBxYYFD-yWY9l2I1wgsKXWx1dpAp1vVv2JgQd2ttHMEe7EHZg2_fNMtY1LNWfFxJzMblSoZdwfRPHRlGMfyc0PZh7kbK1UewhUDh96jYTyDtLePbNRIlafF0wPQger7r3-_vgQ',
    timestamp: 1677477006817,
  },
  stepper: { steps: 0 },
};
