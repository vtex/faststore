import { gql } from '@faststore/graphql-utils'

export const fragment = gql`
  fragment ClientProduct on Query {
    product(locator: $locator) {
      id: productID
    }
  }
`
