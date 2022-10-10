import { without } from 'lodash';

export function isUnique(arr, value) {
  return without(arr, value).length === arr.length - 1;
}
