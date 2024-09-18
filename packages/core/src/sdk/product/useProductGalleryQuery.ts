import { sendAnalyticsEvent } from '@faststore/sdk'

import { gql } from '@generated'
import { useQuery } from 'src/sdk/graphql/useQuery'
import { useSession } from 'src/sdk/session'
import { useLocalizedVariables } from './useLocalizedVariables'

import { Facet } from '@faststore/sdk/dist/types'
import type {
  ClientManyProductsQueryQueryVariables,
  ClientProductGalleryQueryQuery as Query,
  ClientProductGalleryQueryQueryVariables as Variables,
} from '@generated/graphql'
import type { IntelligentSearchQueryEvent } from 'src/sdk/analytics/types'

/**
 * This query is run on the browser and contains
 * the current search state of the user
 *
 * The query definition has to stay on top, or else it fails
 */
export const query = gql(`
  query ClientProductGalleryQuery(
    $first: Int!
    $after: String!
    $sort: StoreSort!
    $term: String!
    $selectedFacets: [IStoreSelectedFacet!]!
    $fuzzy: String
  ) {
    ...ClientProductGallery
    redirect(term: $term, selectedFacets: $selectedFacets) {
      url
    }
    search(
      first: $first
      after: $after
      sort: $sort
      term: $term
      selectedFacets: $selectedFacets
      fuzzy: $fuzzy
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

  fragment SearchEvent_metadata on SearchMetadata {
    isTermMisspelled
    logicalOperator
  }
`)

type ProductGalleryQueryOptions = {
  itemsPerPage: number
  selectedFacets: Facet[]
  sort: ClientManyProductsQueryQueryVariables['sort']
  term: ClientManyProductsQueryQueryVariables['term']
  fuzzy?: string
}

export const useProductGalleryQuery = ({
  term,
  sort,
  selectedFacets,
  itemsPerPage,
  fuzzy,
}: ProductGalleryQueryOptions) => {
  const { locale } = useSession()

  const localizedVariables = useLocalizedVariables({
    first: itemsPerPage,
    after: '0',
    sort,
    term: term ?? '',
    selectedFacets,
    fuzzy,
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
