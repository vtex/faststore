import { gql } from '@faststore/graphql-utils'

export const fragment = gql`
  fragment TopSearchSuggestions on Query {
    search(first: 5, term: $term, selectedFacets: $selectedFacets) {
      suggestions {
        terms {
          value
        }
      }
    }
  }
`
