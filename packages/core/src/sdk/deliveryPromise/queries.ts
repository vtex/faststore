import { gql } from '@generated'
import type {
  ClientPickupPointsQueryQuery as ClientPickupPointsQuery,
  ClientPickupPointsQueryQueryVariables as ClientPickupPointsQueryVariables,
} from '@generated/graphql'

import { deliveryPromise } from 'discovery.config'
import { request } from 'src/sdk/graphql/request'

const pickupPointsQuery = gql(`
  query ClientPickupPointsQuery(
    $geoCoordinates: IStoreGeoCoordinates
    $postalCode: String
    $country: String
  ) {
    pickupPoints(geoCoordinates: $geoCoordinates, postalCode: $postalCode, country: $country) {
      paging {
        total
      }
      items {
        pickupPoint {
          id
          address {
            street
            number
            postalCode
            city
            state
          }
          friendlyName
        }
        distance
      }
    }
  }
`)

type GetPickupPointsProps = {
  country: string | null
  postalCode: string | null
  geoCoordinates: {
    latitude: number
    longitude: number
  } | null
}

export const getPickupPoints = async ({
  country,
  postalCode,
  geoCoordinates,
}: GetPickupPointsProps) => {
  if (!deliveryPromise.enabled) {
    return []
  }

  if (!geoCoordinates && (!postalCode || !country)) {
    return []
  }

  const variables = {
    country: !!geoCoordinates ? undefined : country,
    geoCoordinates: geoCoordinates ?? undefined,
    postalCode: !!geoCoordinates ? undefined : postalCode,
  }

  const data = await request<
    ClientPickupPointsQuery,
    ClientPickupPointsQueryVariables
  >(pickupPointsQuery, variables)

  if (!data) {
    return []
  }

  const pickupPoints = data.pickupPoints.items.map((item) => ({
    id: item.pickupPoint?.id,
    name: item.pickupPoint?.friendlyName,
    totalItems: data.pickupPoints.paging.total,
    address: {
      street: item.pickupPoint?.address?.street,
      number: item.pickupPoint?.address?.number,
      postalCode: item.pickupPoint?.address?.postalCode,
      city: item.pickupPoint?.address?.city,
      state: item.pickupPoint?.address?.state,
    },
    distance: item.distance,
  }))

  return pickupPoints
}
