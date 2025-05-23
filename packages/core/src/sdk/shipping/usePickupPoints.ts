import { useMemo } from 'react'
import { gql } from '@generated'
import type {
  ClientPickupPointsQueryQuery,
  ClientPickupPointsQueryQueryVariables,
} from '@generated/graphql'

import { deliveryPromise } from 'discovery.config'
import { useSession } from 'src/sdk/session'
import { useQuery } from 'src/sdk/graphql/useQuery'

export const query = gql(`
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
          }
          friendlyName
        }
      }
    }
  }
`)

export const usePickupPoints = () => {
  if (!deliveryPromise.enabled) {
    return null
  }

  const { country, postalCode, geoCoordinates, isValidating } = useSession()

  if (!geoCoordinates && (!postalCode || !country)) {
    return null
  }

  const hasGeoCoordinates = !!geoCoordinates
  const { data } = useQuery<
    ClientPickupPointsQueryQuery,
    ClientPickupPointsQueryQueryVariables
  >(
    query,
    {
      country: country,
      geoCoordinates: undefined, //geoCoordinates ?? undefined,
      postalCode: postalCode,
    },
    { fallbackData: null, suspense: true, doNotRun: isValidating }
  )

  if (!data) {
    return null
  }
  console.log('pickupPoints', data)
  const pickupPoints = data.pickupPoints.items.map((item) => ({
    id: item.pickupPoint?.id,
    addressStreet: item.pickupPoint?.address?.street,
    name: item.pickupPoint?.friendlyName,
    totalItems: data.pickupPoints.paging.total,
  }))

  return pickupPoints
}
