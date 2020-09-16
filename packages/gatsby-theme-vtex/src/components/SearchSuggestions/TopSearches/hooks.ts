import { gql } from '@vtex/gatsby-plugin-graphql'

import { useQuery } from '../../../sdk/graphql/useQuery'
import { useSearchSuggestionsContext } from '../base/hooks'
import {
  TopSearchesSuggestionsQuery,
  TopSearchesSuggestionsQueryQuery,
  TopSearchesSuggestionsQueryQueryVariables,
} from './__generated__/TopSearchesSuggestionsQuery.graphql'

export const useTopSearches = () => {
  const context = useSearchSuggestionsContext()
  const query = useQuery<
    TopSearchesSuggestionsQueryQuery,
    TopSearchesSuggestionsQueryQueryVariables
  >({
    ...TopSearchesSuggestionsQuery,
    variables: {},
  })

  return {
    query,
    ...context,
  }
}

export const query = gql`
  query TopSearchesSuggestionsQuery {
    vtex {
      topSearches {
        searches {
          term
          key: term
        }
      }
    }
  }
`
