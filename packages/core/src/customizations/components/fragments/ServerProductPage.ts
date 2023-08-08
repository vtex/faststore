import { gql } from '@faststore/graphql-utils'

export const fragment = gql`
  fragment ServerProductPage on Query {
    product(locator: $locator) {
      id: productID
    }
  }
`
