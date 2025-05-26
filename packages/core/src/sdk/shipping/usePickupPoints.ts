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
    addressStreet: item.pickupPoint?.address?.street,
    name: item.pickupPoint?.friendlyName,
    totalItems: data.pickupPoints.paging.total,
  }))

  return pickupPoints
}
