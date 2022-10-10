import { warn } from '@/api/logger';

const LOCAL_STORAGE_KEY_PREFIX = 'maistra';

function getName(name) {
  return `${LOCAL_STORAGE_KEY_PREFIX}-${name}`;
}

function localStorageCall(methodName, name, args = []) {
  try {
    return localStorage[methodName](getName(name), ...args);
  } catch (e) {
    warn('Error with local storage service!');
    return false;
  }
}

export function setItem(name, value) {
  localStorageCall('setItem', name, [value]);
}

export function getItem(name) {
  return localStorageCall('getItem', name);
}

export function removeItem(name) {
  localStorageCall('removeItem', name);
}
