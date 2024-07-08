import { uid } from 'uid';
import { REACT_APP_TARIFFTYPES } from 'src/utils/constants';

export const extractData = (
  response: any,
  insuraceType: any,
  tariff: string[],
  insurerr: string[],
  title: string
) => {
  const data = response?.data?.value.map((item: any) => {
    const insId1 = insuraceType.find(
      (insID: any) => insID?.insuranceId === item.insuranceId
    );
    return {
      id: uid(16),
      displayString: item.displayString,
      fee: item.fee,
      symbol: insId1?.symbol,
      descriptions: item.descriptions,
      insuranceName: insId1?.insuranceName,
      insuranceId: insId1?.insuranceId,
      selected: false,
      tarrifId: item.id,
      tariffType: title,
    } as ContributionOption;
  });
  if (tariff[0] !== '' && insurerr[0] !== '') {
    return data.filter((item: ContributionOption) => {
      return (
        tariff.includes(item.tarrifId) &&
        insurerr.includes(item.insuranceId.toString())
      );
    });
  } else if (tariff[0] !== '') {
    return data.filter((item: ContributionOption) => {
      return tariff.includes(item.tarrifId);
    });
  } else if (insurerr[0] !== '') {
    return data.filter((item: ContributionOption) => {
      return insurerr.includes(item.insuranceId.toString());
    });
  }
  return data;
};

export const extractCalculateTarrifType = (type: string) => {
  return type.split(',').map((ob) => {
    if (ob === 'Ambulant') {
      return {
        calclulateAmbulant: true,
      };
    } else if (ob === 'Stationär') {
      return {
        calclulateInpatient: true,
      };
    } else if (ob === 'Zahn') {
      return {
        calclulateTooth: true,
      };
    } else {
      return {};
    }
  });
};

export const createTariffObject = (
  tariffTypesEnv: string,
  tariffTypesHeadingEnv: string
): Record<string, string> => {
  const tariffTypes: string[] = tariffTypesEnv.split(',');
  const tariffTypesHeading: string[] = tariffTypesHeadingEnv.split(',');

  if (tariffTypes.length !== tariffTypesHeading.length) {
    throw new Error(
      'Mismatched number of values in the environment variables.'
    );
  }

  const tariffObject: Record<string, string> = {};
  tariffTypes.forEach((type, index) => {
    tariffObject[type] = tariffTypesHeading[index];
  });

  return tariffObject;
};

export const extractCalculateTarrifHeading = (type: string) => {
  return type.split(',').map((obj) => {
    return {
      title: obj,
      total: 0,
      options: [],
    } as ContributionCategory;
  });
};

export const getHeadingsByTypes = (types: String[]) => {
  const headings = types.map((type) => {
    const tariff = REACT_APP_TARIFFTYPES.find((tariff) => tariff.type === type);
    return tariff ? tariff.heading : null;
  });
  return headings.filter((heading) => heading !== null).join(',');
};

export const getCookieValue = (key: string): string => {
  const cookies: string[] = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie: string = cookies[i].trim();

    if (cookie.indexOf(`${key}=`) === 0) {
      return cookie.substring(key.length + 1, cookie.length);
    }
  }
  return '';
};
