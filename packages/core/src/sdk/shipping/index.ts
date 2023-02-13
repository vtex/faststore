import type { IShippingItem } from '@faststore/api'
import { gql } from '@faststore/graphql-utils'

import type {
  ShippingSimulationQueryQuery as Query,
  ShippingSimulationQueryQueryVariables as Variables,
} from '@generated/graphql'

import { request } from '../graphql/request'

const query = gql`
  query ShippingSimulationQuery(
    $postalCode: String!
    $country: String!
    $items: [IShippingItem!]!
  ) {
    shipping(items: $items, postalCode: $postalCode, country: $country) {
      logisticsInfo {
        slas {
          carrier
          price
          shippingEstimate
          localizedEstimates
        }
      }
      address {
        city
        neighborhood
      }
    }
  }
`

export type ShippingQueryData = {
  items: IShippingItem[]
  postalCode: string
  country: string
}

export const getShippingSimulation = async ({
  items,
  postalCode,
  country,
}: ShippingQueryData) => {
  const data = await request<Query, Variables>(query, {
    items,
    postalCode,
    country,
  })

  return data.shipping
}

export default getShippingSimulation
