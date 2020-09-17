import { gql } from '@vtex/gatsby-plugin-graphql'

import { useQuery } from '../graphql/useQuery'
import {
  TopSearchesSuggestionsQuery,
  TopSearchesSuggestionsQueryQuery,
  TopSearchesSuggestionsQueryQueryVariables,
} from './__generated__/TopSearchesSuggestionsQuery.graphql'

export const useTopSearches = () =>
  useQuery<
    TopSearchesSuggestionsQueryQuery,
    TopSearchesSuggestionsQueryQueryVariables
  >({
    ...TopSearchesSuggestionsQuery,
    variables: {},
  })

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
