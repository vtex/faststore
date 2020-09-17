import { gql } from '@vtex/gatsby-plugin-graphql'

import { useQuery } from '../graphql/useQuery'
import {
  AutocompleteSuggestionsQuery,
  AutocompleteSuggestionsQueryQuery,
  AutocompleteSuggestionsQueryQueryVariables,
} from './__generated__/AutocompleteSuggestionsQuery.graphql'

export const useAutocompleteSearchSeggestions = (term: string) =>
  useQuery<
    AutocompleteSuggestionsQueryQuery,
    AutocompleteSuggestionsQueryQueryVariables
  >({
    ...AutocompleteSuggestionsQuery,
    variables: {
      fullText: term,
    },
  })

export const query = gql`
  query AutocompleteSuggestionsQuery($fullText: String!) {
    vtex {
      autocompleteSearchSuggestions(fullText: $fullText) {
        searches {
          term
          key: term
        }
      }
    }
  }
`
