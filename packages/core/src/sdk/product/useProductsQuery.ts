import { gql } from '@faststore/graphql-utils'
import { useCallback, useMemo } from 'react'
import { useSWRConfig } from 'swr'

import type {
  ClientProductsQueryQuery,
  ClientProductsQueryQueryVariables,
} from '@generated/graphql'
import { ITEMS_PER_SECTION } from 'src/constants'

import { prefetchQuery } from '../graphql/prefetchQuery'
import type { QueryOptions } from '../graphql/useQuery'
import { useQuery } from '../graphql/useQuery'
import { useSession } from '../session'

export const query = gql`
  query ClientProductsQuery(
    $first: Int!
    $after: String
    $sort: StoreSort!
    $term: String!
    $selectedFacets: [IStoreSelectedFacet!]!
  ) {
    ...ClientProductsFragment
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

const toArray = <T>(x: T[] | T | undefined) =>
  Array.isArray(x) ? x : x ? [x] : []

export const useLocalizedVariables = ({
  first,
  after,
  sort,
  term,
  selectedFacets,
}: Partial<ClientProductsQueryQueryVariables>) => {
  const { channel, locale } = useSession()

  return useMemo(() => {
    const facets = toArray(selectedFacets)

    return {
      first: first ?? ITEMS_PER_SECTION,
      after: after ?? '0',
      sort: sort ?? ('score_desc' as const),
      term: term ?? '',
      selectedFacets: [
        ...facets,
        { key: 'channel', value: channel ?? '' },
        { key: 'locale', value: locale },
      ],
    }
  }, [selectedFacets, first, after, sort, term, channel, locale])
}

/**
 * Use this hook for fetching a list of products, like in search results and shelves
 */
export const useProductsQuery = (
  variables: Partial<ClientProductsQueryQueryVariables>,
  options?: QueryOptions
) => {
  const localizedVariables = useLocalizedVariables(variables)

  const { data } = useQuery<
    ClientProductsQueryQuery,
    ClientProductsQueryQueryVariables
  >(query, localizedVariables, {
    fallbackData: null,
    suspense: true,
    ...options,
  })

  return data?.search?.products
}

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
