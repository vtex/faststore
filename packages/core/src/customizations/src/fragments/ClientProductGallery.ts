import { gql } from '@generated'

export const fragment = gql(`
  fragment ClientProductGallery on Query {
    search(
      first: $first
      after: $after
      sort: $sort
      term: $term
      selectedFacets: $selectedFacets
      fuzzy: $fuzzy
    ) {
      products {
        pageInfo {
          totalCount
        }
      }
    }
  }
`)
