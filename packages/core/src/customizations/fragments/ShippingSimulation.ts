import { gql } from '@faststore/graphql-utils'

export const fragment = gql`
  fragment ShippingSimulation on Query {
    shipping(items: $items, postalCode: $postalCode, country: $country) {
      address {
        city
      }
    }
  }
`
