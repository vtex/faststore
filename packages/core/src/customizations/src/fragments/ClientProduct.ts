import { gql } from '@generated'

export const fragment = gql(`
  fragment ClientProduct on Query {
    product(locator: $locator) {
      id: productID
    }
  }
`)
