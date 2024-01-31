import { gql } from '@generated'

export const fragment = gql(`
  fragment ClientTopSearchSuggestions on Query {
    search(first: 5, term: $term, selectedFacets: $selectedFacets) {
      suggestions {
        terms {
          value
        }
      }
    }
  }
`)
