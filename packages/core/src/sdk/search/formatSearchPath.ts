import type { SearchState } from '@vtex/faststore-sdk'
import { formatSearchState, initSearchState } from '@vtex/faststore-sdk'

type FormatSearchPath = {
  term: string
  sort?: SearchState['sort']
}

export const formatSearchPath = ({ term, sort }: FormatSearchPath) => {
  const { pathname, search } = formatSearchState(
    initSearchState({
      term,
      sort,
      base: '/s',
    })
  )

  return `${pathname}${search}`
}
