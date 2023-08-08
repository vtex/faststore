import { gql } from '@faststore/graphql-utils'

export const fragment = gql`
  fragment ServerCollectionPageQueryFragment on Query {
    collection(slug: $slug) {
      id
    }
  }
  # fragment BrowserProductGalleryQueryFragment on search {
  #   search(
  #     first: $first
  #     after: $after
  #     sort: $sort
  #     term: $term
  #     selectedFacets: $selectedFacets
  #   ) {
  #     products {
  #       pageInfo {
  #         totalCount
  #       }
  #     }
  #   }
  # }
`
