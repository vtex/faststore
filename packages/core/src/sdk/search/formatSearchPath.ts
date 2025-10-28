import type { SearchState } from '@vtex/faststore-sdk-internal'
import {
  formatSearchState,
  initSearchState,
} from '@vtex/faststore-sdk-internal'

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
