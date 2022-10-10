import { budgetCurrencies } from 'enums/currencies';

export default class Budget {
  constructor({ amount, currency, name }) {
    this.amount = amount;
    this.currency = currency;
    this.name = name;
  }

  get currencySymbol() {
    return budgetCurrencies[this.currency];
  }

  static from(budget = {}) {
    return new Budget(budget);
  }

  static deserialize({ amount, currency, name }) {
    return Budget.from({
      amount,
      currency,
      name
    });
  }
}
