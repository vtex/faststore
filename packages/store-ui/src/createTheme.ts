import merge from 'deepmerge'

export const createTheme = (...args: any) => merge.all(args)
