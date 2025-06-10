import { gql } from '@generated'
import type {
  ClientPickupPointsQueryQuery,
  ClientPickupPointsQueryQueryVariables,
} from '@generated/graphql'
import { useMemo } from 'react'

import { deliveryPromise } from 'discovery.config'
import { useQuery } from 'src/sdk/graphql/useQuery'
import { useSession } from 'src/sdk/session'

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

export const usePickupPoints = () => {
  if (!deliveryPromise.enabled) {
    return null
  }

  const { country, postalCode, geoCoordinates } = useSession()

  if (!geoCoordinates && (!postalCode || !country)) {
    return null
  }

  const variables = useMemo(
    () => ({
      country: !!geoCoordinates ? undefined : country,
      geoCoordinates: geoCoordinates ?? undefined,
      postalCode: !!geoCoordinates ? undefined : postalCode,
    }),
    [country, geoCoordinates, postalCode]
  )

  const { data } = useQuery<
    ClientPickupPointsQueryQuery,
    ClientPickupPointsQueryQueryVariables
  >(query, variables, {
    fallbackData: null,
  })

  if (!data) {
    return null
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
