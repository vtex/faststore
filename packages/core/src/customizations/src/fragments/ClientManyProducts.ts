import { gql } from '@generated'

export const fragment = gql(`
  fragment ClientManyProducts on Query {
    search(
      first: $first
      after: $after
      sort: $sort
      term: $term
      selectedFacets: $selectedFacets
      sponsoredCount: $sponsoredCount
      userId: $userId
      macId: $macId
    ) {
      products {
        pageInfo {
          totalCount
        }
      }
    }
  }
`)
