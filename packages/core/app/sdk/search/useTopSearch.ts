import { gql } from '@generated'
import type {
  ClientSearchSuggestionsQueryQuery as Query,
  ClientSearchSuggestionsQueryQueryVariables as Variables,
} from '@generated/graphql'
import { useQuery } from 'app/sdk/graphql/useQuery'

import { useSession } from '../session'

const query = gql(`
  query ClientTopSearchSuggestionsQuery(
    $term: String!
    $selectedFacets: [IStoreSelectedFacet!]
  ) {
    ...ClientTopSearchSuggestions
    search(first: 5, term: $term, selectedFacets: $selectedFacets) {
      suggestions {
        terms {
          value
        }
      }
    }
  }
`)

function useTopSearch() {
  const { channel, locale } = useSession()

  const { data, error } = useQuery<Query, Variables>(query, {
    term: '',
    selectedFacets: [
      { key: 'channel', value: channel ?? '' },
      { key: 'locale', value: locale },
    ],
  })

  return {
    data,
    error,
  }
}

export default useTopSearch
