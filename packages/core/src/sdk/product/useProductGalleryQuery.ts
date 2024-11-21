import { gql } from '@generated'
import { useQuery } from 'src/sdk/graphql/useQuery'
import { useSession } from 'src/sdk/session'
import { useLocalizedVariables } from './useLocalizedVariables'

import { useSearch } from '@faststore/sdk'
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
    fuzzy
  }
`)

type ProductGalleryQueryOptions = {
  itemsPerPage: number
  selectedFacets: Facet[]
  sort: ClientManyProductsQueryQueryVariables['sort']
  term: ClientManyProductsQueryQueryVariables['term']
}

export const findFacetValue = (
  facets: Facet[],
  searchParam: string
): string | null => {
  const facet = facets.find(({ key }) => key === searchParam)
  return facet?.value ?? null
}

export const useProductGalleryQuery = ({
  term,
  sort,
  selectedFacets,
  itemsPerPage,
}: ProductGalleryQueryOptions) => {
  const { locale } = useSession()
  const { state, setState } = useSearch()
  const localizedVariables = useLocalizedVariables({
    first: itemsPerPage,
    after: '0',
    sort,
    term: term ?? '',
    selectedFacets,
  })

  const fuzzyFacetValue = findFacetValue(selectedFacets, 'fuzzy')
  const operatorFacetValue = findFacetValue(selectedFacets, 'operator')

  const queryResult = useQuery<Query, Variables>(query, localizedVariables, {
    onSuccess: (data) => {
      if (data && term && fuzzyFacetValue && operatorFacetValue) {
        import('@faststore/sdk').then(({ sendAnalyticsEvent }) => {
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
        })
      }
    },
  })

  // If there is no fuzzy or operator facet, we need to add them to the selectedFacets and re-fetch the query
  const shouldRefetchQuery =
    !queryResult.error && (!fuzzyFacetValue || !operatorFacetValue)

  if (shouldRefetchQuery) {
    if (queryResult.data) {
      setState({
        ...state,
        selectedFacets: [
          ...selectedFacets,
          { key: 'fuzzy', value: queryResult.data.search.metadata?.fuzzy },
          {
            key: 'operator',
            value: queryResult.data.search.metadata?.logicalOperator,
          },
        ],
      })
    }

    // The first result is not relevant, return null data to avoid rendering the page while the query is being re-fetched
    return { ...queryResult, isValidating: true, data: null }
  }

  return queryResult
}
