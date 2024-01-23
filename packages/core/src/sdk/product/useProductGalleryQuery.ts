import { sendAnalyticsEvent } from '@faststore/sdk'
import { useSearch, setFacet } from '@faststore/sdk'

import { gql } from '@generated'
import { useQuery } from 'src/sdk/graphql/useQuery'
import { useLocalizedVariables } from './useLocalizedVariables'
import { useSession } from 'src/sdk/session'

import type {
  ClientProductGalleryQueryQuery as Query,
  ClientProductGalleryQueryQueryVariables as Variables,
} from '@generated/graphql'
import type { IntelligentSearchQueryEvent } from 'src/sdk/analytics/types'
import type { Facet } from '@faststore/sdk/dist/types'

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
  ) {
    ...ClientProductGallery
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

  fragment SearchEvent_metadata on SearchMetadata {
    isTermMisspelled
    logicalOperator
  }
`)

export const useProductGalleryQuery = ({
  term,
  sort,
  selectedFacets,
  itemsPerPage,
}) => {
  const { locale } = useSession()
  const { state, setState } = useSearch()

  const localizedVariables = useLocalizedVariables({
    first: itemsPerPage,
    after: '0',
    sort,
    term: term ?? '',
    selectedFacets,
  })

  const findAndSetFacetValue = (
    facets: Facet[],
    key: string,
    newValue: string
  ) => {
    const existingFacetValue = facets?.find(
      (facet: Facet) => facet.key === key
    )?.value

    if (!existingFacetValue) {
      setState({
        ...state,
        selectedFacets: setFacet(
          state.selectedFacets,
          { key, value: newValue },
          true
        ),
      })
    }
  }

  return useQuery<Query, Variables>(query, localizedVariables, {
    onSuccess: (data) => {
      if (data && term) {
        findAndSetFacetValue(
          selectedFacets,
          'fuzzy',
          data.search.metadata?.fuzzy
        )
        findAndSetFacetValue(
          selectedFacets,
          'operator',
          data.search.metadata?.logicalOperator
        )

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
