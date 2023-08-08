import { gql } from '@faststore/graphql-utils'

export const fragment = gql`
  fragment ClientProductFragment on Query {
    product(locator: $locator) {
      id: productID
    }
  }
`
