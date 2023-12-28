import { gql } from '@generated'

export const fragment = gql(`
  fragment ClientShippingSimulation on Query {
    shipping(items: $items, postalCode: $postalCode, country: $country) {
      address {
        city
      }
    }
  }
`)
