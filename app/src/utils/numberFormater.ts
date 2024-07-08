const germanNumberFormat = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatNumber(number: number) {
  return germanNumberFormat.format(number);
}

export function convertCurrencyString(currencyString: string) {
  let cleanString = currencyString.replace(/[€\s]/g, '');
  cleanString = cleanString.replace(',', '.');
  let number = Number(parseFloat(cleanString).toFixed(2));
  return number;
}
