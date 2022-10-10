import { isEmpty } from 'lodash';

import { percentify } from 'utils/string';

import currenciesEnum from 'enums/currencies';
import { numericFormattingTypesEnum } from 'enums/numeric-formatting-types';

export const numericFormatting = {
  computed: {
    numericFormatting() {
      return this.formatting && this.formatting.numeric;
    },

    isPercentageChange() {
      return Boolean(
        this.numericFormatting && this.numericFormatting.percentageChange
      );
    },

    formattedValue() {
      return this.applyNumericFormatting(parseFloat(this.value));
    }
  },

  methods: {
    toDecimal(value, decimalPlaces) {
      return value.toLocaleString('de', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces
      });
    },

    toPercentage(value, places, asOffset) {
      return asOffset
        ? percentify(
            this.handlePrefix(this.toDecimal((value - 1) * 100, places))
          )
        : percentify(this.toDecimal(value * 100, places));
    },

    toCurrency(value, type, decimalPlaces) {
      return `${
        currenciesEnum.find(({ name }) => name === type).symbol
      } ${new Intl.NumberFormat('en-GB', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces
      }).format(value)}`;
    },

    handlePrefix(value) {
      return value > 0 ? `+${value}` : value;
    },

    applyNumericFormatting(value) {
      if (!this.numericFormatting || isEmpty(this.numericFormatting)) {
        return new Intl.NumberFormat('en-GB', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      }

      if (this.numericFormatting.type === numericFormattingTypesEnum.NUMBER) {
        return new Intl.NumberFormat('en-GB', {
          minimumFractionDigits: this.numericFormatting.decimalPlaces,
          maximumFractionDigits: this.numericFormatting.decimalPlaces
        }).format(value);
      } else if (
        this.numericFormatting.type === numericFormattingTypesEnum.PERCENTAGE
      ) {
        return this.toPercentage(
          value,
          this.numericFormatting.decimalPlaces,
          this.numericFormatting.percentageChange
        );
      } else if (
        this.numericFormatting.type === numericFormattingTypesEnum.CURRENCY
      ) {
        return this.toCurrency(
          value,
          this.numericFormatting.currency,
          this.numericFormatting.decimalPlaces
        );
      }

      return value.toLocaleString('de');
    }
  }
};
