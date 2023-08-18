import { gql } from '@faststore/graphql-utils'

import type {
  ClientProductsQueryQuery,
  ClientProductsQueryQueryVariables,
} from '@generated/graphql'

import type { QueryOptions } from '../graphql/useQuery'
import { useQuery } from '../graphql/useQuery'
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

/**
 * Use this hook for fetching a list of products, like shelves and tiles
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

  return data
}
