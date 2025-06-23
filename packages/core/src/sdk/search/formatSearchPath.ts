import type { GlobalSearchState as SearchState } from '@faststore/sdk'
import {
  formatGlobalSearchState as formatSearchState,
  initGlobalSearchState as initSearchState,
} from '@faststore/sdk'

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
