import { gql } from '@faststore/graphql-utils'

export const fragment = gql`
  fragment pdp on Query {
    product(locator: [{ key: "slug", value: $slug }]) {
      id: productID
    }
  }
`
