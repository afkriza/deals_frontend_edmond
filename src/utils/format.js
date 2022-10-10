import { format } from 'date-fns';
import { chunkEvery, flatten, intersperse } from 'utils/collection';
import { currenciesEnum, currenciesFormat } from 'enums/currencies';

export function formatInteger(number, separator = '.') {
  const characters = Array.from(String(number).replace('-', ''));

  const digitGroups = chunkEvery(characters.reverse(), 3);
  const formatted = flatten(intersperse(digitGroups, separator))
    .reverse()
    .join('');

  return number < 0 ? `-${formatted}` : formatted;
}

export function formatDecimal(
  number,
  fixpoint = 1,
  separator = '.',
  decimalSeparator = ','
) {
  const [integral, decimal] = String(number.toFixed(fixpoint)).split('.');

  return `${formatInteger(integral, separator)}${decimalSeparator}${decimal}`;
}

export function formatPercentage(
  number,
  fixpoint = 1,
  separator = '.',
  decimalSeparator = ','
) {
  if (!isFinite(number)) {
    return '-';
  }

  return `${formatDecimal(
    100 * number,
    fixpoint,
    separator,
    decimalSeparator
  )}%`;
}

export function formatDate(date, pattern) {
  return format(date, pattern);
}

export function simpleFormatNumber(
  number,
  fixpoint,
  separator,
  decimalSeparator
) {
  if (typeof number !== 'number' || Number.isNaN(number)) {
    return '–';
  }

  const numberString = String(number);

  return numberString.indexOf('.') >= 0
    ? formatDecimal(number, fixpoint, separator, decimalSeparator)
    : formatInteger(number, separator);
}

export function simpleFormatCurrency(
  number,
  fixpoint,
  separator,
  decimalSeparator,
  currencySymbol = '€'
) {
  return `${simpleFormatNumber(
    number,
    fixpoint,
    separator,
    decimalSeparator
  )} ${currencySymbol}`;
}

export function formatChange(number, separator = '.') {
  const formatted = simpleFormatNumber(number, 1, separator);

  return number >= 0 ? `+${formatted}` : formatted;
}

export function revertPriceNumber(number) {
  return number.split(currenciesFormat.ENGLAND.divider).join('');
}

export function formatPriceNumber(
  number,
  format = currenciesFormat.ENGLAND.format,
  props
) {
  let numberFormatOptions = props;
  if (!numberFormatOptions && !Number.isInteger(number)) {
    numberFormatOptions = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };
  }
  return new Intl.NumberFormat(format, numberFormatOptions).format(number);
}

export function formatWithDecimal(number, decimalPlaces, divider) {
  const decimalItems = Array.from(Array(decimalPlaces).keys())
    .map(() => '0')
    .join('');

  return `${number}${divider}${decimalItems}`;
}

export function formatWithCurrency(number, symbol = '€') {
  return `${symbol} ${number}`;
}

export function formatWithPercentage(number, symbol = '%') {
  return `${number}${symbol}`;
}

export function formatPriceNumberWithCurrency(
  number,
  {
    format = currenciesFormat.ENGLAND.format,
    currency = currenciesEnum.EURO.symbol
  } = {}
) {
  return formatWithCurrency(formatPriceNumber(number, format), currency);
}

export function formatNumber(
  number,
  options = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  },
  locales = currenciesFormat.ENGLAND.format
) {
  return new Intl.NumberFormat(locales, options).format(number);
}
