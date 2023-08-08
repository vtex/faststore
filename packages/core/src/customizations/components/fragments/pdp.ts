import { gql } from '@faststore/graphql-utils'

export const fragment = gql`
  fragment BrowserProductQueryFragment on Query {
    product(locator: $locator) {
      id: productID
    }
  }
  fragment ServerProductPageQueryFragment on Query {
    product(locator: $locator) {
      id: productID
    }
  }
`
