import { useCallback, useEffect, useMemo, useState } from 'react'
import config from '../../../discovery.config'
import { sessionStore } from 'src/sdk/session'
import { createStore, type SearchState } from '@faststore/sdk'
import { usePickupPoints } from 'src/sdk/shipping/usePickupPoints'
import type { useFilter } from 'src/sdk/search/useFilter'
import {
  getRegionalizationSettings,
  type RegionalizationCmsData,
} from 'src/utils/globalSettings'
import type { Filter_FacetsFragment } from '@generated/graphql'

const PickupPointFacetKey = 'pickupPoint' as const
const ShippingFacetKey = 'shipping' as const
const PickUpPointFacetValue = 'pickup-in-point' as const

type Facet = SearchState['selectedFacets'][number]
type DeliveryPromiseStore = {
  isLoading: boolean
}

const deliveryPromise = createStore<DeliveryPromiseStore>(
  {
    isLoading: false,
  },
  'useDeliveryPromise'
)

type Props = {
  deliverySettings: RegionalizationCmsData['deliverySettings']
  allFacets: ReturnType<typeof useFilter>['facets']
  fallbackToFirst: boolean
  toggleFacet?: (facets: Facet) => void
  selectedFacets: Array<Facet>
}

/**
 * @param fallbackToFirst When true, the first available pickup point will be used as the pickup-in-point facet
 * when the shopper has not yet explicitly chosen a pickup point.
 */
export function useDeliveryPromise({
  allFacets,
  deliverySettings: deliverySettingsData,
  fallbackToFirst = true,
  selectedFacets = [],
  toggleFacet,
}: Props) {
  const regionalizationData = getRegionalizationSettings({
    deliverySettings: deliverySettingsData,
  })
  const { deliverySettings } = regionalizationData

  const pickupPoints = usePickupPoints()
  const [isLoading, setIsLoading] = useState(deliveryPromise.read().isLoading)
  const [postalCode, setPostalCode] = useState(sessionStore.read().postalCode)
  const [geoCoordinates, setGeoCoordinates] = useState(
    sessionStore.read().geoCoordinates
  )

  const isDeliveryPromiseEnabled = config.deliveryPromise.enabled

  useEffect(() => {
    const unsubscribers = [
      deliveryPromise.subscribe((storeValue) => {
        setIsLoading(storeValue.isLoading)
      }),
      sessionStore.subscribe((newSession) => {
        setPostalCode(newSession.postalCode)
        setGeoCoordinates(newSession.geoCoordinates)
      }),
    ]

    return () => {
      unsubscribers.forEach((unsub) => unsub())
    }
  }, [])

  const pickupPointByID = useCallback(
    (id: string) => {
      if (!pickupPoints?.length) return

      const value = pickupPoints.find((el) => el.id === id)

      if (fallbackToFirst && !value) return pickupPoints[0]

      return value
    },
    [pickupPoints]
  )

  const selectedPickupPointId = useMemo(
    () => selectedFacets.find(({ key }) => key === PickupPointFacetKey)?.value,
    [selectedFacets]
  )

  const selectedPickupPoint = useMemo(
    () => pickupPointByID(selectedPickupPointId),
    [pickupPointByID, selectedPickupPointId]
  )

  const allDeliveryMethodsFacet = useMemo(
    () => ({
      value: 'all-delivery-methods',
      label:
        deliverySettings?.deliveryMethods?.allDeliveryMethods ??
        'All delivery methods',
      selected:
        !selectedFacets.find((facet) => facet.key === ShippingFacetKey) ||
        selectedFacets?.some(
          (facet) =>
            facet.key === ShippingFacetKey &&
            facet.value === 'all-delivery-methods'
        ),
      quantity: 0,
    }),
    [selectedFacets, deliverySettings]
  )

  const pickupInPointFacet = useMemo(
    () => ({
      value: PickUpPointFacetValue,
      label: selectedPickupPoint?.name ?? selectedPickupPoint?.address.street,
      selected: selectedFacets?.some(
        ({ value }) => value === PickUpPointFacetValue
      ),
      quantity: selectedPickupPoint?.totalItems,
    }),
    [selectedPickupPoint, selectedFacets]
  )

  const facets = useMemo(() => {
    return !isDeliveryPromiseEnabled
      ? allFacets.filter(({ key }) => key !== ShippingFacetKey)
      : allFacets.map((facet) => {
          if (
            facet.key !== ShippingFacetKey ||
            facet.__typename !== 'StoreFacetBoolean'
          )
            return facet

          facet.values = withUniqueFacet(facet.values, allDeliveryMethodsFacet)
          const pickupInPointFacetIndex = facet.values.findIndex(
            (item) => item?.value === PickUpPointFacetValue
          )

          // Remove old pickup `pickup in point` facet from list and search state
          if (pickupInPointFacetIndex !== -1 && !selectedPickupPoint) {
            const selectedShippingFacet = selectedFacets.find(
              ({ key }) => key === ShippingFacetKey
            )
            if (selectedShippingFacet) {
              const selectedPickupInPointFacets = selectedFacets.filter(
                ({ key, value }) =>
                  value === PickUpPointFacetValue || key === PickupPointFacetKey
              )

              selectedPickupInPointFacets.length
                ? selectedPickupInPointFacets.forEach(toggleFacet)
                : toggleFacet(selectedShippingFacet)
            }

            // removes pickupInPointIndex from array
            facet.values.splice(pickupInPointFacetIndex, 1)
          }
          // Prevent multiple `pickup in point` facet
          else if (pickupInPointFacetIndex === -1 && selectedPickupPoint) {
            facet.values = withUniqueFacet(facet.values, pickupInPointFacet)
          }
          // Replace current `pickup-in-point` facet with the updated one
          else if (
            facet.values[pickupInPointFacetIndex] &&
            facet.values[pickupInPointFacetIndex]?.label !==
              pickupInPointFacet.label
          ) {
            facet.values[pickupInPointFacetIndex] = pickupInPointFacet
          }

          facet.values = facet.values.sort((a, b) =>
            (a.value ?? '').localeCompare(b.value ?? '')
          )

          return facet
        })
  }, [
    allDeliveryMethodsFacet,
    pickupInPointFacet,
    allFacets,
    selectedFacets,
    selectedPickupPoint,
    toggleFacet,
  ])

  return {
    mandatory: config.deliveryPromise.mandatory,
    isEnabled: isDeliveryPromiseEnabled,
    isLoading,
    geoCoordinates,
    postalCode,
    pickupPoints,
    selectedPickupPoint,
    pickupPointByID,
    facets,
    selectedFacets,
    deliveryLabel: deliverySettings?.title ?? 'Delivery',
    isPickupAllEnabled:
      deliverySettings?.deliveryMethods?.pickupAll?.enabled ?? false,
    shouldDisplayDeliveryButton: isDeliveryPromiseEnabled && !postalCode,
  }
}

type BoleanFacet = Extract<
  Filter_FacetsFragment,
  { __typename: 'StoreFacetBoolean' }
>['values'][number]

function withUniqueFacet(facets: Array<BoleanFacet>, facet: BoleanFacet) {
  return facets.filter((item) => item.value !== facet.value).concat([facet])
}
