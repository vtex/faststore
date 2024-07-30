import type { IShippingItem } from '@faststore/api'

import { gql } from '@generated'
import type {
  ClientShippingSimulationQueryQuery as Query,
  ClientShippingSimulationQueryQueryVariables as Variables,
} from '@generated/graphql'

import { request } from 'app/sdk/graphql/request'

const query = gql(`
  query ClientShippingSimulationQuery(
    $postalCode: String!
    $country: String!
    $items: [IShippingItem!]!
  ) {
    ...ClientShippingSimulation
    shipping(items: $items, postalCode: $postalCode, country: $country) {
      logisticsInfo {
        slas {
          carrier
          price
          availableDeliveryWindows {
            startDateUtc
            endDateUtc
            price
            listPrice
          }
          shippingEstimate
          localizedEstimates
        }
      }
      address {
        city
        neighborhood
        state
      }
    }
  }
`)

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

  return data
}

export default getShippingSimulation
