import { gql } from '@faststore/graphql-utils'

export const fragment = gql`
  fragment ClientSingleProduct on Query {
    product(locator: $locator) {
      id: productID
    }
  }
`
