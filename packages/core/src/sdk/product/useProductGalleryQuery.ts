import { gql } from '../../../@generated'
import { useQuery } from '../graphql/useQuery'
import { useSession } from '../session'
import { useLocalizedVariables } from './useLocalizedVariables'

import { type SearchState, useSearch } from '@vtex/faststore-sdk'
import type { Facet } from '@vtex/faststore-sdk/types'
import type {
  ClientManyProductsQueryQueryVariables,
  ClientProductGalleryQueryQuery as Query,
  ClientProductGalleryQueryQueryVariables as Variables,
} from '../../../@generated/graphql'
import type { IntelligentSearchQueryEvent } from '../analytics/types'

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

type UpdateSearchParamsType = {
  selectedFacets: Facet[]
  updatedFuzzyFacetValue?: string | null
  updatedOperatorFacetValue?: string | null
  setState: (newState: SearchState) => false | void
  state: SearchState
}

/**
 * This function updates the search params state with the new fuzzy and operator values when they change
 *
 * @param selectedFacets - The current selected facets
 * @param updatedFuzzyFacetValue - The new fuzzy value
 * @param updatedOperatorFacetValue - The new operator value
 * @param setState - The function to update the search state
 * @param state - The current search state
 *
 * @returns void
 *
 */
function updateSearchParamsState({
  selectedFacets,
  updatedFuzzyFacetValue,
  updatedOperatorFacetValue,
  setState,
  state,
}: UpdateSearchParamsType) {
  const oldFuzzyFacetValue = findFacetValue(selectedFacets, 'fuzzy')
  const oldOperatorFacetValue = findFacetValue(selectedFacets, 'operator')

  const shouldUpdateFuzzyFacetValue =
    updatedFuzzyFacetValue && updatedFuzzyFacetValue !== oldFuzzyFacetValue

  const shouldUpdateOperatorFacetValue =
    updatedOperatorFacetValue &&
    updatedOperatorFacetValue !== oldOperatorFacetValue

  if (shouldUpdateFuzzyFacetValue || shouldUpdateOperatorFacetValue) {
    // prevents duplicate old facets
    const filteredFacets = selectedFacets.filter(
      (facet) => facet.key !== 'fuzzy' && facet.key !== 'operator'
    )
    setState({
      ...state,
      selectedFacets: [
        ...filteredFacets,
        {
          key: 'fuzzy',
          value: updatedFuzzyFacetValue ?? oldFuzzyFacetValue ?? 'auto',
        },
        {
          key: 'operator',
          value: updatedOperatorFacetValue ?? oldOperatorFacetValue ?? 'and',
        },
      ],
    })
  }
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

  const queryResult = useQuery<Query, Variables>(query, localizedVariables, {
    onSuccess: (data: Query) => {
      const updatedFuzzyFacetValue = data.search.metadata?.fuzzy
      const updatedOperatorFacetValue = data.search.metadata?.logicalOperator

      const params = new URLSearchParams(window.location.search)
      const urlHasFuzzy = params.has('fuzzy')
      const urlHasOperator = params.has('operator')

      const shouldSendAnalyticsEvent =
        data &&
        term &&
        updatedFuzzyFacetValue &&
        updatedOperatorFacetValue &&
        urlHasFuzzy &&
        urlHasOperator

      if (shouldSendAnalyticsEvent) {
        import('@vtex/faststore-sdk').then(({ sendAnalyticsEvent }) => {
          sendAnalyticsEvent<IntelligentSearchQueryEvent>({
            name: 'intelligent_search_query',
            params: {
              locale,
              term,
              url: window.location.href,
              logicalOperator: updatedOperatorFacetValue ?? 'and',
              isTermMisspelled: data.search.metadata?.isTermMisspelled ?? false,
              totalCount: data.search.products.pageInfo.totalCount,
            },
          })
        })
      }

      // Update the Search state (and URL) only if the values from fuzzy and operator changes
      updateSearchParamsState({
        selectedFacets,
        updatedFuzzyFacetValue,
        updatedOperatorFacetValue,
        setState,
        state,
      })
    },
  })

  const fuzzyFacetValue = findFacetValue(selectedFacets, 'fuzzy')
  const operatorFacetValue = findFacetValue(selectedFacets, 'operator')
  const shouldRefetchQuery =
    !queryResult.error && (!fuzzyFacetValue || !operatorFacetValue)
  if (shouldRefetchQuery) {
    // The first result is not relevant, return null data to avoid rendering the page while the query is being re-fetched
    return { ...queryResult, isValidating: true, data: null }
  }

  return queryResult
}
