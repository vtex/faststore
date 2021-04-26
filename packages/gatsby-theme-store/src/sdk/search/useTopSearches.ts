import { gql } from '@vtex/gatsby-plugin-graphql'

import { useQuery } from '../graphql/useQuery'
import { TopSearchesSuggestionsQuery } from './__generated__/TopSearchesSuggestionsQuery.graphql'
import type {
  TopSearchesSuggestionsQueryQuery,
  TopSearchesSuggestionsQueryQueryVariables,
} from './__generated__/TopSearchesSuggestionsQuery.graphql'

export const useTopSearches = () => {
  const { data } = useQuery<
    TopSearchesSuggestionsQueryQuery,
    TopSearchesSuggestionsQueryQueryVariables
  >({
    ...TopSearchesSuggestionsQuery,
    variables: {},
  })

  return data?.vtex.topSearches!.searches
}

export const query = gql`
  query TopSearchesSuggestionsQuery {
    vtex {
      topSearches {
        searches {
          term
        }
      }
    }
  }
`
