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
  ) {
    pickupPoints(geoCoordinates: $geoCoordinates) {
      pickupPointDistances {
        pickupId
        distance
        pickupName
        isActive
        address {
          city
          number
          postalCode
          street
        }
      }
    }
  }
`)

type GetPickupPointsProps = {
  geoCoordinates: {
    latitude: number
    longitude: number
  } | null
}

export const getPickupPoints = async ({
  geoCoordinates,
}: GetPickupPointsProps) => {
  if (!deliveryPromise.enabled) {
    return []
  }

  if (!geoCoordinates) {
    return []
  }

  const variables = {
    geoCoordinates: geoCoordinates ?? undefined,
  }

  const data = await request<
    ClientPickupPointsQuery,
    ClientPickupPointsQueryVariables
  >(pickupPointsQuery, variables)

  if (!data) {
    return []
  }

  const pickupPoints = data.pickupPoints?.pickupPointDistances
    ?.filter((pickupPoint) => pickupPoint.isActive)
    .map((pickupPoint) => ({
      id: pickupPoint?.pickupId,
      name: pickupPoint?.pickupName,
      totalItems: data.pickupPoints?.pickupPointDistances?.length ?? 0,
      address: {
        street: pickupPoint?.address?.street,
        number: pickupPoint?.address?.number,
        postalCode: pickupPoint?.address?.postalCode,
        city: pickupPoint?.address?.city,
      },
      distance: pickupPoint?.distance,
    }))

  return pickupPoints
}
