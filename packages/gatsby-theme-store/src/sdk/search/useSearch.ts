import { useCallback } from 'react'

import { useQueryInfinite } from '../graphql/useQueryInfinite'
import { useFilters } from './useFilters'
import type { QueryOptions } from '../graphql/useQueryInfinite'
import type { SearchFilters } from './Provider'
import { useRegion } from '../region/useRegion'

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

const PAGE_SIZE = 12

export const useSearch = <Query extends BaseQueryShape | undefined>({
  query,
  initialData: firstPageData,
  pageSize = PAGE_SIZE,
}: Options<Query>) => {
  const filters = useFilters()
  const { regionId } = useRegion()

  const initialData = firstPageData && [firstPageData]
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
      let { fullText } = filters

      // This is a pre-rendered search. Like so, we need to fetch the data
      // at the exact same order from the pre-rendered data so we don't have
      // data mismatch
      // TODO: This breaks regionalization, so we don't do it if regionId is set.
      // Need to look into it.
      if (!regionId) {
        const ids =
          page === 0 &&
          firstPageData?.vtex.productSearch?.products?.map((x) => x.id)

        if (Array.isArray(ids)) {
          fullText = `product:${ids.join(';')}`
        }
      }

      const selectedFacets = ([] as typeof filters.selectedFacets)
        .concat(filters?.selectedFacets ?? [])
        .concat(
          regionId
            ? {
                key: 'region-id',
                value: regionId,
              }
            : []
        )

      // TODO: The query itself can't receive query and map parameters, because it breaks,
      // but these values are used elsewhere.
      // So we only remove them from the query variables.
      // Need to find a cleaner solution
      const cleanFilters = {
        ...filters,
        query: null,
        map: null,
        priceRange: null,
      }

      return {
        ...cleanFilters,
        selectedFacets,
        fullText,
        from,
        to,
      }
    },
    {
      revalidateOnMount: true,
      initialData,
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
