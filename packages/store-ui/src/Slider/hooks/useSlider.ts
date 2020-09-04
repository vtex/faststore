import { useState, useMemo, useCallback } from 'react'

import { useInterval } from './useInterval'

interface Options<T> {
  allItems: T[]
  pageSize?: number
  autoplay?: boolean
  autoplayTimeout?: number
}

// "next()" function makes the index value be always smaller than total,
// so the naive "previous()" implementation will always return a value
// within the array ranges
const next = (index: number, total: number) => (index + 1) % total
const previous = (index: number, total: number) => total - index

export const useSlider = <T>({
  allItems,
  pageSize = 1,
  autoplay = false,
  autoplayTimeout = 1e6,
}: Options<T>) => {
  const totalPages = Math.ceil(allItems.length / pageSize)
  const totalItems = allItems.length

  // Page State pagination
  const [page, setPage] = useState(0)

  // Items on current page
  const items = useMemo(
    () => allItems.slice(page * pageSize, (page + 1) * pageSize),
    [allItems, page]
  )

  const setNextPage = useCallback(() => setPage((p) => next(p, totalItems)), [
    totalItems,
  ])

  const setPreviousPage = useCallback(
    () => setPage((p) => previous(p, totalItems)),
    [totalItems]
  )

  useInterval(() => {
    if (!autoplay) {
      return
    }

    setNextPage()
  }, autoplayTimeout)

  return {
    page,
    setPage,
    setNextPage,
    setPreviousPage,
    items,
    totalPages,
  }
}
