import { useState, useMemo, useCallback } from 'react'

import { useInterval } from './useInterval'

export interface UseSliderOptions<T> {
  allItems: T[]
  pageSize?: number
  autoplay?: boolean
  autoplayTimeout?: number
}

// "next()" function makes the index value be always smaller than total,
// so the naive "previous()" implementation will always return a value
// within the array ranges
const next = (index: number, total: number) => (index + 1) % total
const previous = (index: number, total: number) =>
  (total - ((total - index + 1) % total)) % total

export const useSlider = <T>({
  allItems,
  pageSize = 1,
  autoplay = false,
  autoplayTimeout = 1e6,
}: UseSliderOptions<T>) => {
  const totalPages = Math.ceil(allItems.length / pageSize)

  // Page State pagination
  const [page, setPage] = useState(0)

  // Items on current page
  const items = useMemo(
    () => allItems.slice(page * pageSize, (page + 1) * pageSize),
    [allItems, page, pageSize]
  )

  const setNextPage = useCallback(() => setPage((p) => next(p, totalPages)), [
    totalPages,
  ])

  const setPreviousPage = useCallback(
    () => setPage((p) => previous(p, totalPages)),
    [totalPages]
  )

  useInterval(() => {
    if (!autoplay) {
      return
    }

    setNextPage()
  }, autoplayTimeout)

  return {
    totalPages,
    items,
    page,
    setPage,
    setNextPage,
    setPreviousPage,
  }
}
