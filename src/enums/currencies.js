export const currenciesEnum = {
  EURO: {
    name: 'Euro (€)',
    abbr: 'EUR',
    symbol: '€'
  }
};

export const currenciesFormat = {
  GERMANY: {
    format: 'de-DE',
    divider: '.',
    decimal: ','
  },
  ENGLAND: {
    format: 'en-GB',
    divider: ',',
    decimal: '.'
  }
};

export default Object.values(currenciesEnum);

export const budgetCurrencies = {
  Euro: '€'
};
