const userAgent = navigator.userAgent;

export const isWindows = navigator.platform.indexOf('Win') > -1;
export const isInternetExplorer =
  userAgent.indexOf('MSIE ') > -1 ||
  Boolean(userAgent.match(/Trident.*rv\:11\./));
