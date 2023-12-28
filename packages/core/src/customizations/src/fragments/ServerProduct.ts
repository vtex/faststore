import { gql } from '@generated'

export const fragment = gql(`
  fragment ServerProduct on Query {
    product(locator: $locator) {
      id: productID
    }
  }
`)
