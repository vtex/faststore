import merge from 'deepmerge'

const overwriteMerge = (_: any, sourceArray: any, __: any) => sourceArray

export const createTheme = (...args: any) =>
  merge.all(args, { arrayMerge: overwriteMerge })
