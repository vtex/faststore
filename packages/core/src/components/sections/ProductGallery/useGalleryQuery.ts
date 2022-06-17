import { useSearch } from '@faststore/sdk'
import { gql } from '@faststore/graphql-utils'

import { useQuery } from 'src/sdk/graphql/useQuery'
import type {
  ProductGalleryQueryQuery as Query,
  ProductGalleryQueryQueryVariables as Variables,
} from '@generated/graphql'

import { useLocalizedVariables } from '../../../sdk/product/useProductsQuery'

/**
 * This query is run on the browser and contains
 * the current search state of the user
 */
export const query = gql`
  query ProductGalleryQuery(
    $first: Int!
    $after: String!
    $sort: StoreSort!
    $term: String!
    $selectedFacets: [IStoreSelectedFacet!]!
  ) {
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
      }
      facets {
        ...Filter_facets
      }
    }
  }
`

export const useGalleryQuery = () => {
  const {
    state: { term, sort, selectedFacets },
    itemsPerPage,
  } = useSearch()

  const localizedVariables = useLocalizedVariables({
    first: itemsPerPage,
    after: '0',
    sort,
    term: term ?? '',
    selectedFacets,
  })

  return useQuery<Query, Variables>(query, localizedVariables)
}
