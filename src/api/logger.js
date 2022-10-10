function consoleCall(methodName, args) {
  console[methodName](...args); // eslint-disable-line no-console
}

export function warn() {
  consoleCall('warn', arguments);
}

export function log() {
  consoleCall('log', arguments);
}
