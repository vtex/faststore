import { useMemo } from 'react'

import type { State as SearchState } from '../types'
import format from '../utils/format'
import { useSearch } from './useSearch'

const getLink = (state: SearchState) => {
  const { pathname, search } = format(state)

  return `${pathname}${search}`
}

export const usePagination = (totalItems: number) => {
  const { pages, itemsPerPage, state } = useSearch()

  const total = Math.ceil(totalItems / itemsPerPage)
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
