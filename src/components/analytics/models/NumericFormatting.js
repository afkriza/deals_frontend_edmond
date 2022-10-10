import { numericFormattingTypesEnum } from 'enums/numeric-formatting-types';

export default class NumericFormatting {
  constructor({
    currency,
    decimalPlaces = 0,
    percentageChange = false,
    type = numericFormattingTypesEnum.NUMBER
  }) {
    this.currency = currency;
    this.decimalPlaces = decimalPlaces;
    this.percentageChange = percentageChange;
    this.type = type;
  }

  static from(numericFormatting = {}) {
    return new NumericFormatting(numericFormatting);
  }

  static adaptKeys(numericFormatting) {
    return numericFormatting;
  }

  static deserialize({ currency, decimalPlaces, percentageChange, type }) {
    return NumericFormatting.from({
      currency,
      decimalPlaces,
      percentageChange,
      type
    });
  }
}
