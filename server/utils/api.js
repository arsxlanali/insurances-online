require('dotenv').config();
const BASE_URL = process.env.BASE_URL || 'http://localhost:4000'; // Replace with your actual base URL

const ApiUrls = {
  AUTH_LOGIN: '/auth/login/plain/b2c',
  SEND_TOKEN:'/user/sendToken',
  CALCULATE_TARIFFS_ADDITIONAL: '/calculate/tariffs/additional',
  CALCULATE_INSURANCES_ADDITIONAL: '/calculate/insurances/additional',
  OCCUPATION_SEARCH: '/occupation/additional/insurance',
  ORDER_STARTRISKCHECK_ADDITIONAL: '/order/startriskcheck/additional',
  ORDER_CHECKRISKCHECK_ADDITIONAL: '/order/checkriskcheck/additional',
  ORDER_SUBMITORDER_ADDITIONAL: '/order/submitOrder/additional',
  CALCULATE_TARIFFS_DOCUMENTS:
    '/calculate/tariffs/additional/:tariffId/documents',
  ORDER_EVENTDATA: '/order/eventData/:riskCheckId',
  OPTIMIZE_TARIFF_QUALITY: '/optimize/tariff/additional/:tarrifId/quality',
  EMAIL_SEND: '/email/send/:riskCheckId/:tariffId',

  CALCULATE_TARIFFS_FULL: '/calculate/tariffs/full',
  CALCULATE_BENEFITS_FULL: '/calculate/benefits/full?filterTariffTypes=21&filterTariffTypes=22&filterTariffTypes=23&filterTariffTypes=5&filterTariffTypes=6&filterTariffTypes=9&filterTariffTypes=0',
  CALCULATE_BENEFIT_TYPES_FULL: '/calculate/benefittypes/full',
  CALCULATE_MARITALSTATES_FULL: '/calculate/maritalstates/full',
  CALCULATE_OCCUPATIONGROUPS_FULL: '/calculate/occupationgroups/full',
};

// Function to generate full URLs based on the base URL
function generateUrl(route) {
  return `${BASE_URL}${route}`;
}

module.exports = { ApiUrls, generateUrl };
