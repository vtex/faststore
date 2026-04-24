import { useSearch } from '@faststore/sdk'
import {
  PICKUP_IN_POINT_FACET_VALUE,
  PICKUP_POINT_FACET_KEY,
  SHIPPING_FACET_KEY,
  useDeliveryPromiseContext,
} from '.'

export function useDeliveryPromiseFacets() {
  const { state: searchState } = useSearch()

  return {
    deliveryFacets: searchState.selectedFacets.filter(
      pickByKey(['shipping', 'pickupPoint'])
    ),
    shipping: searchState.selectedFacets.filter(pickByKey(['shipping']))?.[0],
    pickupPoint: searchState.selectedFacets.filter(
      pickByKey(['pickupPoint'])
    )?.[0],
  }
}

export function useDeliveryPromiseGlobalFacets() {
  const { globalPickupPoint } = useDeliveryPromiseContext()

  return {
    globalDeliveryFacets: globalPickupPoint
      ? [
          {
            key: PICKUP_POINT_FACET_KEY,
            value: globalPickupPoint.id,
          },
          {
            key: SHIPPING_FACET_KEY,
            value: PICKUP_IN_POINT_FACET_VALUE,
          },
        ]
      : [],
  }
}

const pickByKey =
  (keys: Array<string>) =>
  ({ key }: { key: string }) =>
    keys.includes(key)
