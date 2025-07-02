import { useCallback, useEffect, useMemo, useState } from 'react'
import config from '../../../discovery.config'
import { sessionStore } from 'src/sdk/session'
import { createStore, type SearchState } from '@faststore/sdk'
import { default as useRegion } from 'src/components/region/RegionModal/useRegion'
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
 *
 * @description The `fallbackToFirst` boolean toggle is related to the pickUpPoints, \
 * where in case of none selected it will fallback to the first one found \
 * to use as a pickUpPoint facet.
 */
export function useDeliveryPromise({
  allFacets,
  deliverySettings: deliverySettingsData,
  fallbackToFirst = true,
  selectedFacets = [],
  toggleFacet,
}: Props) {
  const regionalizationData = getRegionalizationSettings(deliverySettingsData)
  const { deliverySettings } = regionalizationData

  const { loading, regionError, setRegion, setRegionError } = useRegion()

  const pickupPoints = usePickupPoints()
  const [isLoading, setIsLoading] = useState(deliveryPromise.read().isLoading)
  const [postalCode, setPostalCode] = useState(sessionStore.read().postalCode)
  const [geoCoordinates, setGeoCoordinates] = useState(
    sessionStore.read().geoCoordinates
  )

  const isEnabled = config.deliveryPromise.enabled

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
    return !isEnabled
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
    isEnabled,
    setRegion,
    isLoading: Boolean(isLoading || loading),
    geoCoordinates,
    postalCode,
    regionError,
    clearRegionError: () => setRegionError(null),
    pickupPoints,
    selectedPickupPointId,
    selectedPickupPoint,
    pickupPointByID,
    facets,
    selectedFacets,
    regionalizationData,
    deliveryLabel: deliverySettings?.title ?? 'Delivery',
    isPickupAllEnabled:
      deliverySettings?.deliveryMethods?.pickupAll?.enabled ?? false,
    shouldDisplayDeliveryButton: isEnabled && !postalCode,
  }
}

type BoleanFacet = Extract<
  Filter_FacetsFragment,
  { __typename: 'StoreFacetBoolean' }
>['values'][number]

function withUniqueFacet(facets: Array<BoleanFacet>, facet: BoleanFacet) {
  return facets.filter((item) => item.value !== facet.value).concat([facet])
}
