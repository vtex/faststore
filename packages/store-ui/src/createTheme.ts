import merge from 'deepmerge'
import type { ThemeUIStyleObject } from 'theme-ui'

const overwriteMerge = (_: any, sourceArray: any, __: any) => sourceArray

export const createTheme = (...args: ThemeUIStyleObject[]) =>
  merge.all(args as any, { arrayMerge: overwriteMerge }) as ThemeUIStyleObject
