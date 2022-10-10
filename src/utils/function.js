export const identity = x => x;

export function prop(name, fallback) {
  return object => {
    return object ? object[name] : fallback;
  };
}

export function equalBy(propName) {
  return x => y => x[propName] === y[propName];
}

// Partial application
export const papp = (f, ...args) => (...rest) => f(...args, ...rest);

export const flip = f => (y, x) => f(x, y);

export const pappSecond = (f, arg) => papp(flip(f), arg);

// Chaining functions (left to right)
export const flow = (...fs) => argument =>
  fs.reduce((input, f) => f(input), argument);

export const uncurry = f => (...args) => args.reduce((fun, arg) => fun(arg), f);

/**
 * Creates a wrapper function that resolves a promise produced by the latest call only.
 * If called N times, only fn's N-th call's returned promise will be considered.
 *
 * @param fn - function that returns a promise
 * @returns {function(...[*]): *} - fn wrapper that resolves only a promise from the latest call
 */
export function resolveLatest(fn) {
  let latestPromise = null;
  return (...args) => {
    const p = fn(...args).then(result => {
      if (p === latestPromise) return result;
      else throw 'stale';
    });
    latestPromise = p;
    return p;
  };
}
