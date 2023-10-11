import { gql } from '@faststore/graphql-utils'

export const fragment = gql`
  fragment ServerCollectionPage on Query {
    collection(slug: $slug) {
      id
    }
  }
`
