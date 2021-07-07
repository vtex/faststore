/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { useMemo, useState } from 'react'

import { useSearch } from './useSearch'

export const useSearchInfinite = () => {
  const { pageInfo, searchParams } = useSearch()
  const [pages, setPages] = useState([searchParams.page])

  return useMemo(() => {
    const nextPage = pages[pages.length - 1] + 1
    const previousPage = pages[0] - 1
    const hasNextPage = pageInfo.total > pages[pages.length - 1] + 1
    const hasPreviousPage = pages[0] > 0

    const fetchPage = (e: any, direction: 'next' | 'prev') => {
      e.target.blur?.()
      e.preventDefault()
      if (direction === 'next' && hasNextPage) {
        setPages([...pages, nextPage])
      } else if (direction === 'prev' && hasPreviousPage) {
        setPages([previousPage, ...pages])
      }
    }

    return {
      nextPage: hasNextPage && nextPage,
      previousPage: hasPreviousPage && previousPage,
      pages,
      fetchNextPage: (e: any) => fetchPage(e, 'next'),
      fetchPreviousPage: (e: any) => fetchPage(e, 'prev'),
    }
  }, [pageInfo.total, pages])
}
