export const initialValues: InitialValues = {
  agentNumber1: '',
  agentNumber2: '',
  tariffsType: [],
  insurer: [],
  tariffs: [],
  firstName: '',
  lastName: '',
  company: '',
  street: '',
  city: '',
  email: '',
  mobile: '',
  zipcode: '',
  landlineNumber: '',
  remarks: '',
};

const getBaseUrl = (): { baseUrl: string; mandant: string } => {
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const baseUrl = `${url.protocol}//${url.host}`;
  const mandant = url.searchParams.get('mandant')?.toString();
  return {
    baseUrl,
    mandant: mandant || '',
  };
};

export const generateDeeplink = (
  values: InitialValues,
  tariffs: any,
  customFields: Field[]
) => {
  const baseUrl = getBaseUrl().baseUrl;
  const mandant = getBaseUrl().mandant;

  const contactInformation = {
    firstName: values.firstName,
    lastName: values.lastName,
    company: values.company,
    street: values.street,
    zipcode: values.zipcode,
    city: values.city,
    phone: values.landlineNumber,
    mobile: values.mobile.toString(),
    email: values.email,
  };
  const selectedTariffIds = values.tariffs.map((value) => {
    const selectedTariff = tariffs.find(
      (tariff: any) => tariff.value === value
    );
    return selectedTariff ? selectedTariff.id : '';
  });

  const customValues: any = {};
  customFields.forEach((field) => {
    customValues[field.backendField] = values[field.backendField];
  });
  console.log(customValues, 'customValues');
  const encodedContactInformation = btoa(JSON.stringify(contactInformation));
  const encodedCustomValues = btoa(JSON.stringify(customValues));
  const remarks = btoa(JSON.stringify(values.remarks));
  const deeplink = `${baseUrl}/?mandant=${mandant}&tarifftypes=${values.tariffsType.join(
    ','
  )}&agentId1=${values.agentNumber1}&agentId2=${values.agentNumber2}&insurers=${
    values.insurer
  }&tariffs=${selectedTariffIds
    .join(',')
    .replaceAll(
      /#/g,
      '@'
    )}&customValues=${encodedCustomValues}&contactInformation=${encodedContactInformation}&remarks=${remarks}`;
  return deeplink;
};
