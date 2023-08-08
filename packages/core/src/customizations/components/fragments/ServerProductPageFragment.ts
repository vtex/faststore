import { gql } from '@faststore/graphql-utils'

export const fragment = gql`
  fragment ServerProductPageFragment on Query {
    product(locator: $locator) {
      id: productID
    }
  }
`
