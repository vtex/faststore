import { gql } from '@faststore/graphql-utils'

export const fragment = gql`
  fragment ServerCollectionPageFragment on Query {
    collection(slug: $slug) {
      id
    }
  }
`
