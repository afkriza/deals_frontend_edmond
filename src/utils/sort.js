// TODO: Add tests

export function compare(a, b) {
  if (a > b) {
    return 1;
  }

  if (a < b) {
    return -1;
  }

  return 0;
}

export function nameComparator(typeA, typeB) {
  const nameA = typeA.name.toUpperCase();
  const nameB = typeB.name.toUpperCase();
  return compare(nameA, nameB);
}
