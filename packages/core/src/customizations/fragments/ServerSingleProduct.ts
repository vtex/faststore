import { gql } from '@faststore/graphql-utils'

export const fragment = gql`
  fragment ServerSingleProduct on Query {
    product(locator: $locator) {
      id: productID
    }
  }
`
