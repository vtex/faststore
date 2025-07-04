import { useCallback, useEffect, useMemo } from 'react'
import deepEquals from 'fast-deep-equal'

import {
  createStore,
  useSearch,
  toggleFacets,
  type SearchState,
  type Session,
} from '@faststore/sdk'
import type { Filter_FacetsFragment } from '@generated/graphql'

import { useSession } from 'src/sdk/session'
import type { useFilter } from 'src/sdk/search/useFilter'
import {
  getRegionalizationSettings,
  type RegionalizationCmsData,
} from 'src/utils/globalSettings'

import { deliveryPromise as deliveryPromiseConfig } from 'discovery.config'
import {
  useDeliveryPromiseContext,
  initialPickupPointsSimulation,
  type PickupPointsSimulation,
} from '.'

const PickupPointFacetKey = 'pickupPoint' as const
const ShippingFacetKey = 'shipping' as const
const PickupInPointFacetValue = 'pickup-in-point' as const

type Facet = SearchState['selectedFacets'][number]

export type PickupPoint = {
  id: string
  name?: string
  address?: {
    street?: string
    number?: string
    postalCode?: string
    city?: string
    state?: string
  }
  distance?: number
  totalItems?: number
}

export type DeliveryPromiseStore = {
  pickupPoints?: PickupPoint[]
  selectedPickupPoint?: PickupPoint | null
  globalPickupPoint?: PickupPoint | null
  shouldUpdatePickupPoints?: boolean
  simulatePickupPoints?: boolean
  pickupPointsSimulation?: PickupPointsSimulation
}

const baseStore = createStore<DeliveryPromiseStore>(
  {
    pickupPoints: [],
    selectedPickupPoint: null,
    globalPickupPoint: null,
    shouldUpdatePickupPoints: true,
  },
  'fs::deliveryPromise'
)

export const deliveryPromiseStore = {
  ...baseStore,
  set: (state: Partial<DeliveryPromiseStore>) => {
    const oldState = baseStore.read()
    const newState = { ...oldState, ...state }

    if (!deepEquals(oldState, newState)) {
      baseStore.set(newState)
    }
  },
}

type Props = {
  deliverySettings?: RegionalizationCmsData['deliverySettings']
  allFacets?: ReturnType<typeof useFilter>['facets']
  fallbackToFirst?: boolean
  selectedFilterFacets?: Facet[]
}

/**
 * @param fallbackToFirst When true, the first available pickup point will be used as the pickup-in-point facet
 * when the shopper has not yet explicitly chosen a pickup point.
 */
export function useDeliveryPromise({
  allFacets,
  selectedFilterFacets = [],
  deliverySettings: deliverySettingsData,
  fallbackToFirst = true,
}: Props = {}) {
  const { postalCode } = useSession()
  const {
    pickupPoints,
    selectedPickupPoint,
    globalPickupPoint,
    pickupPointsSimulation,
    dispatchDeliveryPromiseAction,
    ...deliveryPromiseContext
  } = useDeliveryPromiseContext()
  const { state: searchState, setState: setSearchState } = useSearch()

  const { deliverySettings } = getRegionalizationSettings({
    deliverySettings: deliverySettingsData,
  })
  const isDeliveryPromiseEnabled = deliveryPromiseConfig.enabled
  const selectedPickupPointFacet = useMemo(
    () =>
      searchState.selectedFacets.find(({ key }) => key === PickupPointFacetKey)
        ?.value,
    [searchState.selectedFacets]
  )

  useEffect(() => {
    const unsubscribers = [
      deliveryPromiseStore.subscribe((storeValue) => {
        dispatchDeliveryPromiseAction({
          type: 'updateDeliveryPromiseState',
          payload: {
            ...deliveryPromiseContext,
            ...storeValue,
          },
        })
      }),
    ]

    return () => {
      unsubscribers.forEach((unsub) => unsub())
    }
  }, [])

  useEffect(() => {
    if (pickupPoints.length === 0) return

    deliveryPromiseStore.set({
      selectedPickupPoint: pickupPointByID(selectedPickupPointFacet),
    })
  }, [pickupPoints])

  const pickupPointByID = useCallback(
    (id: string) => {
      if (!pickupPoints?.length) return

      const value = pickupPoints.find((el) => el.id === id)

      if (fallbackToFirst && !value) return pickupPoints[0]

      return value
    },
    [pickupPoints]
  )

  const allDeliveryMethodsFacet = useMemo(
    () => ({
      value: 'all-delivery-methods',
      label:
        deliverySettings?.deliveryMethods?.allDeliveryMethods ??
        'All delivery methods',
      selected:
        !searchState.selectedFacets.find(
          (facet) => facet.key === ShippingFacetKey
        ) ||
        searchState.selectedFacets?.some(
          (facet) =>
            facet.key === ShippingFacetKey &&
            facet.value === 'all-delivery-methods'
        ),
      quantity: 0,
    }),
    [searchState.selectedFacets, deliverySettings]
  )

  const pickupInPointFacet = useMemo(
    () => ({
      value: PickupInPointFacetValue,
      label: selectedPickupPoint?.name ?? selectedPickupPoint?.address.street,
      selected: searchState.selectedFacets?.some(
        ({ value }) => value === PickupInPointFacetValue
      ),
      quantity: selectedPickupPoint?.totalItems,
    }),
    [selectedPickupPoint, searchState.selectedFacets]
  )

  const onDeliveryFacetChange = useCallback(
    ({
      facet = null,
      facets = [],
      filterDispatch,
    }: {
      facet?: Facet
      facets?: Facet[]
      filterDispatch?: ReturnType<typeof useFilter>['dispatch']
    }) => {
      let unique = true
      const facetsToToggle: Facet[] = facets?.length !== 0 ? facets : [facet]
      let currentSelectedFacets = filterDispatch
        ? selectedFilterFacets
        : searchState.selectedFacets

      // Toggle `pickup-in-point` and `pickupPoint` facets
      if (facet.value === PickupInPointFacetValue) {
        facetsToToggle.push({
          key: PickupPointFacetKey,
          value: selectedPickupPoint?.id,
        })
      } else {
        // Toggle previously selected pickupPoint facet
        unique = isRadioFacet(facet.key)
        currentSelectedFacets = currentSelectedFacets.filter(
          ({ key }) => key !== PickupPointFacetKey
        )
        facetsToToggle.concat(currentSelectedFacets)
      }

      // Filter Slider should dispatch filter actions
      if (filterDispatch) {
        filterDispatch({
          type: 'toggleFacets',
          payload: { unique, facets: facetsToToggle },
        })

        return
      }
      setSearchState({
        ...searchState,
        selectedFacets: toggleFacets(
          currentSelectedFacets,
          facetsToToggle,
          unique
        ),
        page: 0,
      })
    },
    [selectedFilterFacets, searchState.selectedFacets, selectedPickupPoint]
  )

  const facets = useMemo(() => {
    if (!allFacets) return []

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
            (item) => item?.value === PickupInPointFacetValue
          )

          // Remove old pickup `pickup in point` facet from list and search state
          if (pickupInPointFacetIndex !== -1 && !selectedPickupPoint) {
            const selectedShippingFacet = searchState.selectedFacets.find(
              ({ key }) => key === ShippingFacetKey
            )

            if (selectedShippingFacet) {
              const selectedPickupInPointFacets =
                searchState.selectedFacets.filter(
                  ({ key, value }) =>
                    value === PickupInPointFacetValue ||
                    key === PickupPointFacetKey
                )

              selectedPickupInPointFacets.length
                ? onDeliveryFacetChange({ facets: selectedPickupInPointFacets })
                : onDeliveryFacetChange({ facet: selectedShippingFacet })
            }

            // Removes pickupInPointIndex from array
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
    searchState.selectedFacets,
    selectedPickupPoint,
    pickupPoints,
  ])

  const onPostalCodeChange = useCallback(
    ({
      simulatePickupPoints = false,
      validatedSession = null,
    }: { simulatePickupPoints?: boolean; validatedSession?: Session } = {}) => {
      const partialSession = {
        country: validatedSession?.country,
        postalCode: validatedSession?.postalCode,
        geoCoordinates: validatedSession?.geoCoordinates,
      }

      dispatchDeliveryPromiseAction({
        type: 'onPostalCodeChange',
        ...(simulatePickupPoints
          ? {
              payload: {
                simulatePickupPoints,
                validatedSession: { ...partialSession },
              },
            }
          : {}),
      })
    },
    []
  )

  const clearPickupPointsSimulation = useCallback(
    () =>
      deliveryPromiseStore.set({
        pickupPointsSimulation: initialPickupPointsSimulation,
      }),
    []
  )

  return {
    mandatory: deliveryPromiseConfig.mandatory,
    isEnabled: isDeliveryPromiseEnabled,
    pickupPoints,
    selectedPickupPoint,
    selectedPickupPointFacet,
    pickupPointsSimulation,
    clearPickupPointsSimulation,
    changePickupPoint: (pickupPoint: PickupPoint) => {
      deliveryPromiseStore.set({ selectedPickupPoint: pickupPoint })
    },
    globalPickupPoint,
    changeGlobalPickupPoint: (pickupPoint: PickupPoint) => {
      deliveryPromiseStore.set({ globalPickupPoint: pickupPoint })
    },
    pickupPointByID,
    facets,
    onPostalCodeChange,
    onDeliveryFacetChange,
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

const RADIO_FACETS = ['shipping', 'pickupPoint'] as const
function isRadioFacet(facet: unknown): facet is (typeof RADIO_FACETS)[number] {
  if (typeof facet !== 'string') return false

  return RADIO_FACETS.some((el) => el === facet)
}
