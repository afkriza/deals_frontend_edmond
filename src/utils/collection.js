import { isEqual, uniqBy, identity } from 'lodash';

export function groupBy(collection, key) {
  return collection.reduce((acc, curr) => {
    let payloadKey = curr[key];
    if (typeof key === 'function') {
      payloadKey = key(curr);
    }
    acc[payloadKey] = acc[payloadKey] || [];
    acc[payloadKey].push(curr);
    return acc;
  }, {});
}

export function unique(collection) {
  return collection.reduce((acc, curr) => {
    if (!acc.includes(curr)) {
      acc.push(curr);
    }
    return acc;
  }, []);
}

export function uniqueDeep(collection) {
  return collection.reduce((acc, curr) => {
    const existValue = acc.find(value => isEqual(value, curr));
    if (!existValue) {
      acc.push(curr);
    }
    return acc;
  }, []);
}

export function flatten(arr) {
  return [].concat(...arr);
}

export function flatMap(arr, f) {
  return flatten(arr.map(f));
}

export function chunkBy(arr, f) {
  return Object.values(groupBy(arr, f));
}

export function chunkEvery(arr, n) {
  const groups = [];

  arr.forEach((value, index) => {
    if (index % n === 0) {
      groups.push([]);
    }

    groups[groups.length - 1].push(value);
  });

  return groups;
}

export function intersperse(arr, pivot) {
  const interspersedArray = [];
  const lastIndex = arr.length - 1;

  arr.forEach((value, index) => {
    interspersedArray.push(value);

    if (index !== lastIndex) {
      interspersedArray.push(pivot);
    }
  });

  return interspersedArray;
}

export function weave(xs, ys) {
  const length = Math.max(xs.length, ys.length);
  const result = [];

  for (let i = 0; i < length; i++) {
    if (i < xs.length) {
      result.push(xs[i]);
    }

    if (i < ys.length) {
      result.push(ys[i]);
    }
  }

  return result;
}

export function pairBy(xs, ys, comparatorFactory) {
  const pairs = [];

  xs.forEach(x => {
    const comparator = comparatorFactory(x);
    const y = ys.find(comparator);

    pairs.push([x, y]);
  });

  return pairs;
}

export function move(arr, oldIndex, newIndex) {
  const element = arr[oldIndex];
  const newArr = arr.filter(val => arr.indexOf(val) !== oldIndex);
  newArr.splice(newIndex, 0, element);

  return newArr;
}

export const toggleArrValue = (value, arr) => {
  if (arr.includes(value)) {
    return arr.filter(item => item !== value);
  }

  return [...arr, value];
};

export const first = ([value]) => value;
export const second = ([, value]) => value;
export const last = arr => arr[arr.length - 1];

export const uniq = arr => uniqBy(arr, identity);

export const multiply = arr => arr.reduce((acc, curr) => acc * curr);
