import { gql } from '@faststore/graphql-utils'

export const fragment = gql`
  fragment ClientTopSearchSuggestions on Query {
    search(first: 5, term: $term, selectedFacets: $selectedFacets) {
      suggestions {
        terms {
          value
        }
      }
    }
  }
`
