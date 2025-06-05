import type { KeyedMutator } from 'swr'
import { gql } from '@generated'
import type {
  ClientManyProductsQueryQuery,
  ClientManyProductsQueryQueryVariables,
} from '@generated/graphql'

import type { QueryOptions } from '../graphql/useQuery'
import { useQuery } from '../graphql/useQuery'
import { useLocalizedVariables } from './useLocalizedVariables'

export const query = gql(`
  query ClientManyProductsQuery(
    $first: Int!
    $after: String
    $sort: StoreSort!
    $term: String!
    $selectedFacets: [IStoreSelectedFacet!]!
    $sponsoredCount: Int
  ) {
    ...ClientManyProducts
    search(
      first: $first
      after: $after
      sort: $sort
      term: $term
      selectedFacets: $selectedFacets
      sponsoredCount: $sponsoredCount
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

// Overloads
export function useProductsQuery(
  variables: Partial<ClientManyProductsQueryQueryVariables>,
  options?: QueryOptions & { fullQueryResponse?: false }
): ClientManyProductsQueryQuery

export function useProductsQuery(
  variables: Partial<ClientManyProductsQueryQueryVariables>,
  options?: QueryOptions & { fullQueryResponse: true }
): {
  error: any
  mutate: KeyedMutator<ClientManyProductsQueryQuery>
  isValidating: boolean
  isLoading: boolean
  data: ClientManyProductsQueryQuery
}

/**
 * Use this hook for fetching a list of products, like shelves and tiles
 */
export function useProductsQuery(
  variables: Partial<ClientManyProductsQueryQueryVariables>,
  options?: QueryOptions
) {
  const localizedVariables = useLocalizedVariables(variables)

  const { data, ...queryResponse } = useQuery<
    ClientManyProductsQueryQuery,
    ClientManyProductsQueryQueryVariables
  >(query, localizedVariables, {
    fallbackData: null,
    suspense: true,
    ...options,
  })

  if (options?.fullQueryResponse) {
    return { data, ...queryResponse }
  }

  return data
}
