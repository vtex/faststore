import { useMemo } from 'react'

import { useQuery } from 'src/sdk/graphql/useQuery'

import { gql } from '@generated'
import type {
  ClientSearchSuggestionsQueryQuery as Query,
  ClientSearchSuggestionsQueryQueryVariables as Variables,
} from '@generated/graphql'
import type { IntelligentSearchAutocompleteQueryEvent } from '../analytics/types'

import { useSession } from '../session'

const query = gql(`
  query ClientSearchSuggestionsQuery(
    $term: String!
    $selectedFacets: [IStoreSelectedFacet!]
  ) {
    ...ClientSearchSuggestions
    search(first: 5, term: $term, selectedFacets: $selectedFacets) {
      suggestions {
        terms {
          value
        }
        products {
          ...ProductSummary_product
        }
      }
      products {
        pageInfo {
          totalCount
        }
      }
      metadata {
        ...SearchEvent_metadata
      }
    }
  }
`)

function useSuggestions(term: string) {
  const { channel, locale } = useSession()

  const variables = useMemo(
    () => ({
      term,
      selectedFacets: [
        { key: 'channel', value: channel ?? '' },
        { key: 'locale', value: locale },
      ],
    }),
    [term, locale, channel]
  )
  const { data, error } = useQuery<Query, Variables>(query, variables, {
    onSuccess: (callbackData) => {
      if (callbackData && term) {
        import('@faststore/sdk').then(({ sendAnalyticsEvent }) => {
          sendAnalyticsEvent<IntelligentSearchAutocompleteQueryEvent>({
            name: 'intelligent_search_autocomplete_query',
            params: {
              locale,
              term,
              url: window.location.href,
              logicalOperator:
                callbackData.search.metadata?.logicalOperator ?? 'and',
              isTermMisspelled:
                callbackData.search.metadata?.isTermMisspelled ?? false,
              totalCount: callbackData.search.products.pageInfo.totalCount,
            },
          })
        })
      }
    },
  })

  return {
    data,
    error,
  }
}

export default useSuggestions
