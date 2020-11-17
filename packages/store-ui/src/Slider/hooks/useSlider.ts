import { useState, useMemo, useCallback, useEffect } from 'react'

export interface UseSliderOptions<T> {
  allItems: T[]
  pageSize?: number
  autoplay?: number // Number in milliseconds for timeout
}

// "next()" function makes the index value be always smaller than total,
// so the naive "previous()" implementation will always return a value
// within the array ranges
const next = (index: number, total: number) => (index + 1) % total
const previous = (index: number, total: number) =>
  (total - ((total - index + 1) % total)) % total

export const useSlider = <T>({
  allItems,
  autoplay,
  pageSize = 1,
}: UseSliderOptions<T>) => {
  const totalPages = Math.ceil(allItems.length / pageSize)

  // Page State pagination
  const [page, setPage] = useState(0)

  // Somehow, the items changed but state kept the same,
  // So go back to first page and apply Effect
  const currentPage = page < allItems.length ? page : 0

  useEffect(() => setPage(0), [allItems])

  // Items on current page
  const items = useMemo(
    () => allItems.slice(currentPage * pageSize, (currentPage + 1) * pageSize),
    [allItems, currentPage, pageSize]
  )

  const setNextPage = useCallback(() => setPage((p) => next(p, totalPages)), [
    totalPages,
  ])

  const setPreviousPage = useCallback(
    () => setPage((p) => previous(p, totalPages)),
    [totalPages]
  )

  useEffect(() => {
    if (typeof autoplay !== 'number' || autoplay < 0) {
      return
    }

    let timeoutId: null | NodeJS.Timeout = null
    const idleCallbackId = window.requestIdleCallback(() => {
      timeoutId = setTimeout(() => setNextPage, autoplay)
    })

    return () => {
      window.cancelIdleCallback(idleCallbackId)

      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }
    }
  }, [page, autoplay, setNextPage])

  return {
    totalPages,
    items,
    page: currentPage,
    setPage,
    setNextPage,
    setPreviousPage,
  }
}
