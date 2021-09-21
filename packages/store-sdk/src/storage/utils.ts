export const isFunction = <T>(x: T | (() => T)): x is () => T =>
  typeof x === 'function'
