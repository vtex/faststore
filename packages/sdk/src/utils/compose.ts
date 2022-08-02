export type Step<T> = (val: T) => T;

export const compose = <T>(pipeline: Step<T>[], value: T) =>
  pipeline.reduce((acc, curr) => curr(acc), value);