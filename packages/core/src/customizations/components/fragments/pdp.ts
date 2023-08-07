import { gql } from '@faststore/graphql-utils'

export const fragment = gql`
  fragment pdp on Query {
    product(locator: $locator) {
      id: productID
    }
  }
`
