import { gql } from '@faststore/graphql-utils'
import { useSearch } from '@faststore/sdk'
import { ClientProductsQueryQueryVariables } from '@generated/graphql'
import { useEffect, useCallback } from 'react'
import type { QueryOptions } from '../graphql/useQuery'
import { useSWRConfig } from 'swr'
import { prefetchQuery } from '../graphql/prefetchQuery'
import { useLocalizedVariables } from './useLocalizedVariables'

export const query = gql`
  query ClientProductsQuery(
    $first: Int!
    $after: String
    $sort: StoreSort!
    $term: String!
    $selectedFacets: [IStoreSelectedFacet!]!
  ) {
    ...ClientProducts
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
`

export const useProductsQueryPrefetch = (
  variables: ClientProductsQueryQueryVariables,
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
