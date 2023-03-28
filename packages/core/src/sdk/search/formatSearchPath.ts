import { formatSearchState, initSearchState } from '@faststore/sdk'

export const formatSearchPath = (term: string) => {
  const { pathname, search } = formatSearchState(
    initSearchState({
      term,
      base: '/s',
    })
  )

  return `${pathname}${search}`
}
