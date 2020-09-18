import { gql } from '@vtex/gatsby-plugin-graphql'

import { useQuery } from '../../../sdk/graphql/useQuery'
import { useSearchSuggestionsContext } from '../base/hooks'
import {
  AutocompleteSuggestionsQuery,
  AutocompleteSuggestionsQueryQuery,
  AutocompleteSuggestionsQueryQueryVariables,
} from './__generated__/AutocompleteSuggestionsQuery.graphql'

export const useAutocompleteSearchSeggestions = () => {
  const context = useSearchSuggestionsContext()
  const query = useQuery<
    AutocompleteSuggestionsQueryQuery,
    AutocompleteSuggestionsQueryQueryVariables
  >({
    ...AutocompleteSuggestionsQuery,
    variables: {
      fullText: context.term,
    },
    suspense: true,
  })

  return {
    query,
    ...context,
  }
}

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
