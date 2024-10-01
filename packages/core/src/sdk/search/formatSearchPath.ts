import type { SearchState } from '@faststore/sdk'
import { formatSearchState, initSearchState } from '@faststore/sdk'

type FormatSearchPath = {
  term: string
  sort?: SearchState['sort']
  fuzzy?: string
}

export const formatSearchPath = ({ term, sort, fuzzy }: FormatSearchPath) => {
  const { pathname, search } = formatSearchState(
    initSearchState({
      term,
      sort,
      base: '/s',
      fuzzy: fuzzy ?? 'auto',
    })
  )

  return `${pathname}${search}`
}
