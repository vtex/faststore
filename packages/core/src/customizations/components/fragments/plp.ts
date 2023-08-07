import { gql } from '@faststore/graphql-utils'

export const fragment = gql`
  fragment plp on Query {
    collection(slug: $slug) {
      id
    }
  }
`
