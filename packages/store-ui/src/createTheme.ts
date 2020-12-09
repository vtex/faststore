import merge from 'deepmerge'
import type { SxStyleProp } from 'theme-ui'

const overwriteMerge = (_: any, sourceArray: any, __: any) => sourceArray

export const createTheme = (...args: SxStyleProp[]) =>
  merge.all(args as any, { arrayMerge: overwriteMerge }) as SxStyleProp
