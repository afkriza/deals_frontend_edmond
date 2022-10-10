import { camelCase } from 'lodash';

export const toSnakeCase = word =>
  word.replace(/([A-Z])/g, (wholeWord, match) => `_${match.toLowerCase()}`);
export const toCamelCase = word =>
  word.replace(/_([A-Za-z])/g, (wholeWord, letter) => letter.toUpperCase());
export const separateByCommas = string => string.split(',').join(', ');
export const capitalize = string =>
  string.charAt(0).toUpperCase() + string.slice(1);
export const toPascalCase = string => capitalize(camelCase(string));
export const generateRandomHex = () =>
  Math.random()
    .toString(36)
    .substr(2, 5);
export const percentify = value => `${value}%`;
export const pixelify = value => `${value}px`;

export const numberToDividedString = (value, dividerChars, dividerType) => {
  const stringArray = value.toString().split('');
  return stringArray
    .map((char, index) => {
      return (index + 1) % dividerChars === 0 &&
        stringArray.length !== index + 1
        ? `${char}${dividerType}`
        : char;
    })
    .join('');
};

export const abbreviation = text => {
  if (typeof text != 'string' || !text) {
    return '';
  }
  return text
    .match(/[\p{Alpha}\p{Nd}]+/gu)
    .reduce(
      (previous, next) =>
        previous +
        (+next === 0 || parseInt(next) ? parseInt(next) : next[0] || ''),
      ''
    )
    .toUpperCase();
};
