import { useMemo } from 'react'

import { sendAnalyticsEvent } from '@faststore/sdk'
import { gql } from '@faststore/graphql-utils'
import { useQuery } from 'src/sdk/graphql/useQuery'

import type {
  SearchSuggestionsQueryQuery as Query,
  SearchSuggestionsQueryQueryVariables as Variables,
} from '@generated/graphql'
import type { IntelligentSearchQueryEvent } from '../analytics/types'

import { useSession } from '../session'

const MAX_SUGGESTIONS = 5

const query = gql`
  query SearchSuggestionsQuery(
    $term: String!
    $selectedFacets: [IStoreSelectedFacet!]
  ) {
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
`

function useSuggestions(term: string, limit: number = MAX_SUGGESTIONS) {
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
        sendAnalyticsEvent<IntelligentSearchQueryEvent>({
          name: 'intelligent_search_query',
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
      }
    },
  })

  return {
    terms: (data?.search.suggestions.terms ?? []).slice(0, limit),
    products: (data?.search.suggestions.products ?? []).slice(0, limit),
    isLoading: !error && !data,
  }
}

export default useSuggestions
