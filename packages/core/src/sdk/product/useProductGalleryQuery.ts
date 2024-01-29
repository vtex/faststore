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

  const findFacetValue = (
    facets: Facet[],
    searchParam: string
  ): string | null => {
    const facet = facets.find(({ key }) => key === searchParam)
    return facet?.value ?? null
  }

  return useQuery<Query, Variables>(query, localizedVariables, {
    onSuccess: (data) => {
      if (data) {
        const fuzzyFacetValue = findFacetValue(selectedFacets, 'fuzzy')
        const operatorFacetValue = findFacetValue(selectedFacets, 'operator')

        if (!fuzzyFacetValue && !operatorFacetValue) {
          setState({
            ...state,
            selectedFacets: [
              ...selectedFacets,
              { key: 'fuzzy', value: data.search.metadata?.fuzzy },
              { key: 'operator', value: data.search.metadata?.logicalOperator },
            ],
          })
        }

        if (term) {
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
      }
    },
  })
}
