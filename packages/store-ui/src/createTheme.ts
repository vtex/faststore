import merge from 'deepmerge'
import type { Theme } from 'styled-system'

const overwriteMerge = (_: unknown, sourceArray: unknown[]) => sourceArray

export const createTheme = (...args: Theme[]) =>
  merge.all(args, { arrayMerge: overwriteMerge }) as Theme
