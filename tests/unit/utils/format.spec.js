import { expect } from 'chai';

import * as formatUtil from 'utils/format';

describe('utils/format', () => {
  describe('formatInteger', () => {
    it('should stringify for numbers <-1000, 1000>', () => {
      expect(formatUtil.formatInteger(0)).to.equal('0');
      expect(formatUtil.formatInteger(100)).to.equal('100');
      expect(formatUtil.formatInteger(999)).to.equal('999');
      expect(formatUtil.formatInteger(-100)).to.equal('-100');
      expect(formatUtil.formatInteger(-999)).to.equal('-999');
    });

    it('should add the separator for every three orders of magnitude', () => {
      expect(formatUtil.formatInteger(1000)).to.equal('1.000');
      expect(formatUtil.formatInteger(10000000)).to.equal('10.000.000');
      expect(formatUtil.formatInteger(-1000)).to.equal('-1.000');
      expect(formatUtil.formatInteger(-10000000)).to.equal('-10.000.000');
    });

    it('should accept a custom separator', () => {
      expect(formatUtil.formatInteger(10000000, ',')).to.equal('10,000,000');
    });
  });

  describe('formatChange', () => {
    it('should format the integer, but add + for positive numbers', () => {
      expect(formatUtil.formatChange(0)).to.equal('+0');
      expect(formatUtil.formatChange(100)).to.equal('+100');
      expect(formatUtil.formatChange(10000000)).to.equal('+10.000.000');
      expect(formatUtil.formatChange(-10000000)).to.equal('-10.000.000');
    });

    it('should accept a custom separator', () => {
      expect(formatUtil.formatChange(10000000, ',')).to.equal('+10,000,000');
      expect(formatUtil.formatChange(-10000000, ',')).to.equal('-10,000,000');
    });
  });

  describe('formatDecimal', () => {
    it('should format the integer and round to one decimal point by default', () => {
      expect(formatUtil.formatDecimal(10)).to.equal('10,0');
      expect(formatUtil.formatDecimal(1000.1)).to.equal('1.000,1');
      expect(formatUtil.formatDecimal(1.4321)).to.equal('1,4');
      expect(formatUtil.formatDecimal(5.59)).to.equal('5,6');

      expect(formatUtil.formatDecimal(-10)).to.equal('-10,0');
      expect(formatUtil.formatDecimal(-1000.1)).to.equal('-1.000,1');
      expect(formatUtil.formatDecimal(-1.4321)).to.equal('-1,4');
      expect(formatUtil.formatDecimal(-5.59)).to.equal('-5,6');
    });

    it('should accept a number of decimals to round to', () => {
      expect(formatUtil.formatDecimal(1.4321, 1)).to.equal('1,4');
      expect(formatUtil.formatDecimal(1.4321, 2)).to.equal('1,43');
      expect(formatUtil.formatDecimal(1.4321, 3)).to.equal('1,432');
      expect(formatUtil.formatDecimal(1.4321, 4)).to.equal('1,4321');
      expect(formatUtil.formatDecimal(1.4321, 5)).to.equal('1,43210');
    });

    it('should accept custom separators for thousands and decimals', () => {
      expect(formatUtil.formatDecimal(1000.1, 1, ',', '.')).to.equal('1,000.1');
    });
  });

  describe('formatPercentage', () => {
    it('should display decimal values as percentages, with thousands and decimal separator', () => {
      expect(formatUtil.formatPercentage(0.8951)).to.equal('89,5%');
      expect(formatUtil.formatPercentage(1)).to.equal('100,0%');
    });

    it('should accept a custom number of decimals', () => {
      expect(formatUtil.formatPercentage(0.8951, 1)).to.equal('89,5%');
      expect(formatUtil.formatPercentage(0.8951, 2)).to.equal('89,51%');
      expect(formatUtil.formatPercentage(0.8951, 3)).to.equal('89,510%');
    });

    it('should accept custom separators', () => {
      expect(formatUtil.formatPercentage(20.8951, 1, ',', '.')).to.equal(
        '2,089.5%'
      );
    });
  });

  describe('formatPriceNumber', () => {
    it('should add the separator for every three orders of magnitude, with separator to be , and decimal sepatrator to be .', () => {
      expect(formatUtil.formatPriceNumber(10000)).to.equal('10,000');
      expect(formatUtil.formatPriceNumber(1000)).to.equal('1,000');
      expect(formatUtil.formatPriceNumber(1000.34)).to.equal('1,000.34');
    });
  });

  describe('formatWithCurrency', () => {
    it('should add to given string/number currency symbol to the start.', () => {
      expect(formatUtil.formatWithCurrency(10000, '€')).to.equal('€ 10000');
      expect(formatUtil.formatWithCurrency(10000, '£')).to.equal('£ 10000');
    });
  });

  describe('formatWithPercentage', () => {
    it('should add to given string/number percent symbol to the end.', () => {
      expect(formatUtil.formatWithPercentage(10000)).to.equal('10000%');
    });
  });

  describe('formatPriceNumberWithCurrency', () => {
    it('should format price number with defaults', () => {
      expect(formatUtil.formatPriceNumberWithCurrency(10000)).to.equal(
        '€ 10,000'
      );
      expect(formatUtil.formatPriceNumberWithCurrency(-241)).to.equal('€ -241');
      expect(formatUtil.formatPriceNumberWithCurrency(0)).to.equal('€ 0');
      expect(formatUtil.formatPriceNumberWithCurrency(123.45)).to.equal(
        '€ 123.45'
      );
      expect(formatUtil.formatPriceNumberWithCurrency(12300.45)).to.equal(
        '€ 12,300.45'
      );
      expect(formatUtil.formatPriceNumberWithCurrency(12300.4501923)).to.equal(
        '€ 12,300.45'
      );
      expect(formatUtil.formatPriceNumberWithCurrency(12300.4593)).to.equal(
        '€ 12,300.46'
      );
      expect(formatUtil.formatPriceNumberWithCurrency(12300.4)).to.equal(
        '€ 12,300.40'
      );
    });

    it('should format price number with given options', () => {
      expect(
        formatUtil.formatPriceNumberWithCurrency(10000, {
          currency: '$'
        })
      ).to.equal('$ 10,000');
    });
  });
});
