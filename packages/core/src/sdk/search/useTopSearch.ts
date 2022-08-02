import { gql } from '@faststore/graphql-utils'

import { useQuery } from 'src/sdk/graphql/useQuery'
import type {
  StoreSuggestionTerm,
  SearchSuggestionsQueryQuery as Query,
  SearchSuggestionsQueryQueryVariables as Variables,
} from '@generated/graphql'

import { useSession } from '../session'

const MAX_TOP_SEARCH_TERMS = 5

const query = gql`
  query TopSearchSuggestionsQuery(
    $term: String!
    $selectedFacets: [IStoreSelectedFacet!]
  ) {
    search(first: 5, term: $term, selectedFacets: $selectedFacets) {
      suggestions {
        terms {
          value
        }
      }
    }
  }
`

function useTopSearch(
  initialTerms: StoreSuggestionTerm[] = [],
  limit: number = MAX_TOP_SEARCH_TERMS
) {
  const { channel, locale } = useSession()

  const { data, error } = useQuery<Query, Variables>(query, {
    term: '',
    selectedFacets: [
      { key: 'channel', value: channel ?? '' },
      { key: 'locale', value: locale },
    ],
  })

  return {
    terms: (data?.search.suggestions.terms ?? initialTerms).slice(0, limit),
    isLoading: !error && !data,
  }
}

export default useTopSearch
