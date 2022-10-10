const storage = {};

export function setItem(name, value) {
  storage[name] = value;
}

export function getItem(name) {
  return storage[name];
}

export function removeItem(name) {
  delete storage[name];
}
