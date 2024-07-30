import { useSearch } from '@faststore/sdk'

import { gql } from '@generated'
import { ClientManyProductsQueryQueryVariables } from '@generated/graphql'
import { useCallback, useEffect } from 'react'

import type { QueryOptions } from 'app/sdk/graphql/useQuery'
import { useSWRConfig } from 'swr'
import { prefetchQuery } from '../graphql/prefetchQuery'
import { useLocalizedVariables } from './useLocalizedVariables'

export const query = gql(`
  query ClientManyProductsQuery(
    $first: Int!
    $after: String
    $sort: StoreSort!
    $term: String!
    $selectedFacets: [IStoreSelectedFacet!]!
  ) {
    ...ClientManyProducts
    search(
      first: $first
      after: $after
      sort: $sort
      term: $term
      selectedFacets: $selectedFacets
    ) {
      products {
        pageInfo {
          totalCount
        }
        edges {
          node {
            ...ProductSummary_product
          }
        }
      }
    }
  }
`)

export const useProductsQueryPrefetch = (
  variables: ClientManyProductsQueryQueryVariables,
  options?: QueryOptions
) => {
  const localizedVariables = useLocalizedVariables(variables)
  const { cache } = useSWRConfig()

  return useCallback(
    () => prefetchQuery(query, localizedVariables, { cache, ...options }),
    [localizedVariables, cache, options]
  )
}

export const useProductsPrefetch = (page: number | null) => {
  const {
    itemsPerPage,
    state: { sort, term, selectedFacets },
  } = useSearch()

  const prefetch = useProductsQueryPrefetch({
    first: itemsPerPage,
    after: (itemsPerPage * (page ?? 0)).toString(),
    sort,
    term: term ?? '',
    selectedFacets,
  })

  useEffect(() => {
    if (page !== null) {
      prefetch()
    }
  }, [page, prefetch])
}
