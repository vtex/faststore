import { useCallback } from 'react'

import { QueryOptions, useQueryInfinite } from '../graphql/useQueryInfinite'
import { SearchFilters } from './Provider'
import { useFilters } from './useFilters'

interface BaseQueryShape {
  vtex: {
    productSearch: Maybe<{
      products: Maybe<any[]>
    }>
  }
}

interface Options<Query extends BaseQueryShape | undefined> {
  query: QueryOptions
  initialData: Query
  pageSize?: number
}

const PAGE_SIZE = 10

export const useSearch = <Query extends BaseQueryShape | undefined>({
  query,
  initialData,
  pageSize = PAGE_SIZE,
}: Options<Query>) => {
  const filters = useFilters()
  const { data, error, size, setSize } = useQueryInfinite<Query, SearchFilters>(
    query,
    (page, previousPageData) => {
      if (
        page !== 0 &&
        previousPageData?.vtex.productSearch?.products?.length === 0
      ) {
        return null
      }

      const from = page * pageSize
      const to = (page + 1) * pageSize - 1

      return {
        ...filters,
        from,
        to,
      }
    },
    {
      revalidateOnMount: true,
      initialData: initialData && [initialData],
      initialSize: 2, // 2 will always prefetch the next page
    }
  )

  const fetchMore = useCallback(() => setSize!((s) => s + 1), [setSize])

  // Since we prefetch the next page, we always render one page less from
  // what we have in memory
  const viewSize = Math.max(1, size! - 1)

  // The code below was copied from SWR's own repo example
  // https://codesandbox.io/s/swr-infinite-z6r0r?file=/src/App.js
  const isLoadingInitialData = !data && !error
  const isLoadingMore =
    isLoadingInitialData ||
    !!(data && typeof data[viewSize - 1] === 'undefined')

  const isEmpty = data?.[0]?.vtex.productSearch!.products!.length === 0
  const isReachingEnd =
    isEmpty ||
    !!(
      data &&
      data[viewSize - 1] &&
      data[viewSize - 1]!.vtex.productSearch!.products!.length < pageSize
    )

  return {
    fetchMore,
    isLoadingMore,
    isReachingEnd,
    data: data?.slice(0, viewSize),
    error,
  }
}
