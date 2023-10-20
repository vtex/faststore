import { gql } from '@faststore/graphql-utils'

export const fragment = gql`
  fragment ClientProductGallery on Query {
    search(
      first: $first
      after: $after
      sort: $sort
      term: $term
      selectedFacets: $selectedFacets
    ) {
      products {
        pageInfo {
          totalCount
        }
      }
    }
  }
`
