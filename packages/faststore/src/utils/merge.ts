import deepmerge from 'deepmerge'

export function merge(...params: any): any {
  return deepmerge.all([...params].filter((p) => p))
}
