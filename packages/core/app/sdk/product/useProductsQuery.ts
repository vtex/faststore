import { gql } from '@generated'
import type {
  ClientManyProductsQueryQuery,
  ClientManyProductsQueryQueryVariables,
} from '@generated/graphql'

import { useLocalizedVariables } from '../../../src/sdk/product/useLocalizedVariables'
import type { QueryOptions } from '../../sdk/graphql/useQuery'
import { useQuery } from '../../sdk/graphql/useQuery'

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

/**
 * Use this hook for fetching a list of products, like shelves and tiles
 */
export const useProductsQuery = (
  variables: Partial<ClientManyProductsQueryQueryVariables>,
  options?: QueryOptions
) => {
  const localizedVariables = useLocalizedVariables(variables)

  const { data } = useQuery<
    ClientManyProductsQueryQuery,
    ClientManyProductsQueryQueryVariables
  >(query, localizedVariables, {
    fallbackData: null,
    suspense: true,
    ...options,
  })

  return data
}
