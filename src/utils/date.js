import { formatISO } from 'date-fns';

export function getDateWithoutYear(isoDate) {
  return isoDate.replace(/^\d+\-/, '');
}

export function getYear(isoDate) {
  const yearString = isoDate.replace(/\-.+$/, '');
  return parseInt(yearString, 10);
}

export function isoToDate(isoDate) {
  return new Date(isoDate);
}

export function formatISODate(date) {
  return formatISO(date, { representation: 'date' });
}
