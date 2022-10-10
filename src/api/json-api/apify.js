import {
  camelCase,
  isArray,
  isDate,
  isObject,
  map,
  mapKeys,
  mapValues,
  snakeCase
} from 'lodash';
import { formatDate } from 'utils/format';

export function iterator(obj, transformer) {
  if (isDate(obj)) {
    return formatDate(obj, 'yyyy-MM-dd');
  } else if (isArray(obj)) {
    return map(obj, value => iterator(value, transformer));
  } else if (isObject(obj)) {
    const copy = mapValues(obj, value => iterator(value, transformer));

    return mapKeys(copy, (_value, key) => transformer(key));
  }

  return obj;
}

export function apify(obj) {
  return iterator(obj, value =>
    value === '_destroy' ? value : snakeCase(value)
  );
}

export function deapify(obj) {
  return iterator(obj, camelCase);
}
