import { useMemo } from 'react'

import type { State as SearchState } from './state'
import { format } from './format'
import { useSearch } from './useSearch'

const getLink = (state: SearchState) => {
  const { pathname, search } = format(state)

  return `${pathname}${search}`
}

/**
 * @deprecated Old state value. \
 * prefer the usage of the one present at sdk/src/search/global-state/usePagination
 */
export const usePagination = (totalItems: number) => {
  const { pages, itemsPerPage, state } = useSearch()

  const total = Math.ceil(totalItems / (itemsPerPage ?? 1))
  const next = Number(pages[pages.length - 1]) + 1
  const prev = pages[0] - 1

  return useMemo(
    () => ({
      next: next < total && {
        cursor: next,
        link: getLink({ ...state, page: next }),
      },
      prev: prev > -1 && {
        cursor: prev,
        link: getLink({ ...state, page: prev }),
      },
    }),
    [next, prev, state, total]
  )
}
