import { gql } from '@vtex/gatsby-plugin-graphql'

import { useQuery } from '../graphql/useQuery'
import { AutocompleteSuggestionsQuery } from './__generated__/AutocompleteSuggestionsQuery.graphql'
import type {
  AutocompleteSuggestionsQueryQuery,
  AutocompleteSuggestionsQueryQueryVariables,
} from './__generated__/AutocompleteSuggestionsQuery.graphql'

interface Props {
  term: string
}

export const useAutocompleteSuggestions = ({ term }: Props) => {
  const { data } = useQuery<
    AutocompleteSuggestionsQueryQuery,
    AutocompleteSuggestionsQueryQueryVariables
  >({
    ...AutocompleteSuggestionsQuery,
    variables: {
      fullText: term,
    },
    suspense: true,
  })

  return data!.vtex.autocompleteSearchSuggestions!.searches!
}

export const query = gql`
  query AutocompleteSuggestionsQuery($fullText: String!) {
    vtex {
      autocompleteSearchSuggestions(fullText: $fullText) {
        searches {
          term
        }
      }
    }
  }
`
