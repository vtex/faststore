import { useCallback, useEffect, useMemo, useState } from 'react'
import config from '../../../discovery.config'
import { sessionStore } from '../session'
import { createStore, useSearch } from '@faststore/sdk'
import { default as useRegion } from '../../components/region/RegionModal/useRegion'
import { usePickupPoints } from '../shipping/usePickupPoints'
import type { useFilter } from '../search/useFilter'
import type { IStoreSelectedFacet } from '@faststore/api'
import type { RegionalizationCmsData } from '../../utils/globalSettings'

const FacetKey = 'pickupPoint' as const
const ShippingFacetKey = 'shipping' as const

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
  selectedFacets: Array<IStoreSelectedFacet>
  deliverySettings: RegionalizationCmsData['deliverySettings']
  allFacets: ReturnType<typeof useFilter>['facets']
  fallbackToFirst: boolean
  toggleFilterFacets: (facets: Array<{ key: string; value: string }>) => void
  togglePickupInPointFacet: (
    facets: Array<{ key: string; value: string }>
  ) => void
}

export function useDeliveryPromise({
  selectedFacets,
  allFacets,
  deliverySettings,
  fallbackToFirst = true,
  toggleFilterFacets,
  togglePickupInPointFacet,
}: Props) {
  const { loading, regionError, setRegion, setRegionError } = useRegion()
  const { state: searchState } = useSearch()

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
    () => searchState.selectedFacets.find(({ key }) => key === FacetKey)?.value,
    [searchState]
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
      selected: !selectedFacets.some(
        (facet) =>
          facet.key === 'shipping' && facet.value !== 'all-delivery-methods'
      ),
      quantity: 0,
    }),
    [selectedFacets, deliverySettings]
  )

  const pickupInPointFacet = useMemo(
    () => ({
      value: 'pickup-in-point',
      label: selectedPickupPoint?.name ?? selectedPickupPoint?.address.street,
      selected: !!selectedFacets.find(
        ({ value }) => value === 'pickup-in-point'
      ),
      quantity: selectedPickupPoint?.totalItems,
    }),
    [selectedPickupPoint, selectedFacets]
  )

  const facets = useMemo(() => {
    return !isEnabled
      ? allFacets.filter(({ key }) => key === ShippingFacetKey)
      : allFacets.map((facet) => {
          if (
            facet.key !== ShippingFacetKey ||
            facet.__typename !== 'StoreFacetBoolean'
          )
            return facet

          facet.values = withUniqueFacet(facet.values, allDeliveryMethodsFacet)
          const pickupInPointFacetIndex = facet.values.findIndex(
            (item) => item?.value === 'pickup-in-point'
          )

          // Remove old pickup `pickup in point` facet from list and search state
          if (pickupInPointFacetIndex !== -1 && !selectedPickupPoint) {
            const selectedShippingFacet = selectedFacets.find(
              ({ key }) => key === ShippingFacetKey
            )
            if (selectedShippingFacet) {
              const selectedPickupInPointFacets = selectedFacets.filter(
                ({ key, value }) =>
                  value === 'pickup-in-point' || key === 'pickupPoint'
              )

              selectedPickupInPointFacets.length
                ? togglePickupInPointFacet(selectedPickupInPointFacets)
                : toggleFilterFacets([selectedShippingFacet])
            }

            // removes pickupInPointIndex from array
            facet.values.splice(pickupInPointFacetIndex, 1)
          }
          // Prevent multiple `pickup in point` facet
          else if (pickupInPointFacetIndex === -1 && selectedPickupPoint) {
            facet.values.push(pickupInPointFacet)
          }
          // Replace current `pickup-in-point` facet with the updated one
          else if (
            facet.values[pickupInPointFacetIndex] &&
            facet.values[pickupInPointFacetIndex]?.label !==
              pickupInPointFacet.label
          ) {
            facet.values[pickupInPointFacetIndex] = pickupInPointFacet
          }

          return facet
        })
  }, [
    selectedPickupPoint,
    pickupInPointFacet,
    toggleFilterFacets,
    togglePickupInPointFacet,
    allFacets,
    selectedFacets,
  ])

  return {
    mandatory: config.deliveryPromise.mandatory,
    isEnabled,
    setRegion,
    isLoading: isLoading || loading,
    geoCoordinates,
    postalCode,
    regionError,
    clearRegionError: () => setRegionError(null),
    pickupPoints,
    selectedPickupPointId,
    selectedPickupPoint,
    pickupPointByID,
    facets,
  }
}

type Values = Extract<
  Props['allFacets'][number],
  { __typename: 'StoreFacetBoolean' }
>['values']
function withUniqueFacet(values: Values, facet: Values[number]) {
  if (!values.some((item) => item.value === facet.value)) {
    return [facet, ...values]
  }

  return values
}
