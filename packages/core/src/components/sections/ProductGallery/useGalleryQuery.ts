import { sendAnalyticsEvent, useSearch } from '@faststore/sdk'
import { gql } from '@faststore/graphql-utils'

import { useQuery } from 'src/sdk/graphql/useQuery'

import type {
  ProductGalleryQueryQuery as Query,
  ProductGalleryQueryQueryVariables as Variables,
} from '@generated/graphql'
import type { IntelligentSearchQueryEvent } from 'src/sdk/analytics/types'

import { useLocalizedVariables } from '../../../sdk/product/useProductsQuery'
import { useSession } from 'src/sdk/session'

/**
 * This query is run on the browser and contains
 * the current search state of the user
 */
export const query = gql`
  fragment SearchEvent_metadata on SearchMetadata {
    isTermMisspelled
    logicalOperator
  }

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
      metadata {
        ...SearchEvent_metadata
      }
    }
  }
`

export const useGalleryQuery = () => {
  const {
    state: { term, sort, selectedFacets },
    itemsPerPage,
  } = useSearch()

  const { locale } = useSession()

  const localizedVariables = useLocalizedVariables({
    first: itemsPerPage,
    after: '0',
    sort,
    term: term ?? '',
    selectedFacets,
  })

  return useQuery<Query, Variables>(query, localizedVariables, {
    onSuccess: (data) => {
      if (data && term) {
        sendAnalyticsEvent<IntelligentSearchQueryEvent>({
          name: 'intelligent_search_query',
          params: {
            locale,
            term,
            url: window.location.href,
            logicalOperator: data.search.metadata?.logicalOperator ?? 'and',
            isTermMisspelled: data.search.metadata?.isTermMisspelled ?? false,
            totalCount: data.search.products.pageInfo.totalCount,
          },
        })
      }
    },
  })
}
