import type { SearchState } from '@faststore/sdk'
import { formatSearchState, initSearchState } from '@faststore/sdk'
import { useCallback } from 'react'

import { useSearchBase } from 'src/sdk/search/useSearchBase'

const DEFAULT_SEARCH_BASE = '/s'

export type FormatSearchPathParams = {
  term: string
  sort?: SearchState['sort']
}

/**
 * Builds the search URL path for a given term and sort.
 * Pass `base` (e.g. from resolveLink('/s')) to include locale/custom path so the path is correct for the current context.
 */
export const formatSearchPath = (
  { term, sort }: FormatSearchPathParams,
  base: string = DEFAULT_SEARCH_BASE
) => {
  const { pathname, search } = formatSearchState(
    initSearchState({
      term,
      sort,
      base,
    })
  )

  return `${pathname}${search}`
}

/**
 * Hook that returns a function to build the search path with the current locale/custom path base.
 */
export function useFormatSearchPath(): (
  params: FormatSearchPathParams
) => string {
  const searchBase = useSearchBase()
  return useCallback(
    (params: FormatSearchPathParams) => formatSearchPath(params, searchBase),
    [searchBase]
  )
}
