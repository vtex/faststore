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

export const PICKUP_POINT_FACET_KEY = 'pickupPoint' as const
export const SHIPPING_FACET_KEY = 'shipping' as const
export const PICKUP_IN_POINT_FACET_VALUE = 'pickup-in-point' as const
export const ALL_DELIVERY_METHODS_FACET_VALUE = 'all-delivery-methods' as const

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
  defaultPickupPoint?: PickupPoint | null
  globalPickupPoint?: PickupPoint | null
  shouldUpdatePickupPoints?: boolean
  simulatePickupPoints?: boolean
  pickupPointsSimulation?: PickupPointsSimulation
}

const baseStore = createStore<DeliveryPromiseStore>(
  {
    pickupPoints: [],
    defaultPickupPoint: null,
    globalPickupPoint: null,
    shouldUpdatePickupPoints: false,
    pickupPointsSimulation: undefined,
    simulatePickupPoints: false,
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
  fallbackToFirstPickupPoint?: boolean
  selectedFilterFacets?: Facet[]
}

/**
 * @param fallbackToFirstPickupPoint When true, the first available pickup point will be used as the pickup-in-point facet
 * when the shopper has not yet explicitly chosen a pickup point.
 */
export function useDeliveryPromise({
  allFacets,
  selectedFilterFacets = [],
  deliverySettings: deliverySettingsData,
  fallbackToFirstPickupPoint = true,
}: Props = {}) {
  const { postalCode } = useSession()
  const { state: searchState, setState: setSearchState } = useSearch()
  const {
    pickupPoints,
    defaultPickupPoint,
    globalPickupPoint,
    pickupPointsSimulation,
    dispatchDeliveryPromiseAction,
    shouldUpdatePickupPoints,
    ...deliveryPromiseContext
  } = useDeliveryPromiseContext()

  const isDeliveryPromiseEnabled = deliveryPromiseConfig.enabled
  const { deliverySettings } = getRegionalizationSettings({
    deliverySettings: deliverySettingsData,
  })
  const selectedPickupPointFacet = useMemo(
    () =>
      searchState.selectedFacets.find(
        ({ key }) => key === PICKUP_POINT_FACET_KEY
      )?.value,
    [searchState.selectedFacets, pickupPoints]
  )

  // Update Delivery Promise global state after store changes
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

  // Set the default selected pickup point based on pickup points list
  useEffect(() => {
    if (pickupPoints.length === 0) return

    deliveryPromiseStore.set({
      defaultPickupPoint: pickupPointByID(selectedPickupPointFacet),
    })
  }, [pickupPoints, selectedPickupPointFacet])

  const pickupPointByID = useCallback(
    (id: string) => {
      if (!pickupPoints?.length) return

      const value = pickupPoints.find((el) => el.id === id)

      if (fallbackToFirstPickupPoint && !value) return pickupPoints[0]

      return value
    },
    [pickupPoints]
  )

  const allDeliveryMethodsFacet = useMemo(
    () => ({
      value: ALL_DELIVERY_METHODS_FACET_VALUE,
      label:
        deliverySettings?.deliveryMethods?.allDeliveryMethods ??
        'All delivery methods',
      selected:
        !selectedFilterFacets.some(
          (facet) => facet.key === SHIPPING_FACET_KEY
        ) ||
        selectedFilterFacets?.some(
          (facet) =>
            facet.key === SHIPPING_FACET_KEY &&
            facet.value === ALL_DELIVERY_METHODS_FACET_VALUE
        ),
      quantity: 0,
    }),
    [selectedFilterFacets, deliverySettings]
  )

  const pickupInPointFacet = useMemo(
    () => ({
      value: PICKUP_IN_POINT_FACET_VALUE,
      label: defaultPickupPoint?.name ?? defaultPickupPoint?.address.street,
      selected: selectedFilterFacets?.some(
        ({ value }) => value === PICKUP_IN_POINT_FACET_VALUE
      ),
      quantity: defaultPickupPoint?.totalItems,
    }),
    [pickupPoints, defaultPickupPoint, selectedFilterFacets]
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
      let currentSelectedFacets = selectedFilterFacets

      // Toggle `pickup-in-point` and `pickupPoint` facets
      if (facet?.value === PICKUP_IN_POINT_FACET_VALUE) {
        facetsToToggle.push({
          key: PICKUP_POINT_FACET_KEY,
          value: defaultPickupPoint?.id,
        })
      } else {
        // Toggle previously selected pickupPoint facet
        unique = isRadioFacet(facet?.key)
        currentSelectedFacets = currentSelectedFacets.filter(
          ({ key }) => key !== PICKUP_POINT_FACET_KEY
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
    [selectedFilterFacets, defaultPickupPoint]
  )

  const facets = useMemo(() => {
    if (!allFacets) return []

    return !isDeliveryPromiseEnabled || !postalCode
      ? allFacets.filter(({ key }) => key !== SHIPPING_FACET_KEY)
      : allFacets.map((facet) => {
          if (
            facet.key !== SHIPPING_FACET_KEY ||
            facet.__typename !== 'StoreFacetBoolean'
          )
            return facet

          facet.values = withUniqueFacet(facet.values, allDeliveryMethodsFacet)
          const pickupInPointFacetIndex = facet.values.findIndex(
            (item) => item?.value === PICKUP_IN_POINT_FACET_VALUE
          )

          // Remove old pickup `pickup in point` facet from list and search state
          if (pickupInPointFacetIndex !== -1 && !defaultPickupPoint) {
            const selectedShippingFacet = selectedFilterFacets.find(
              ({ key }) => key === SHIPPING_FACET_KEY
            )

            if (selectedShippingFacet) {
              const selectedPickupInPointFacets = selectedFilterFacets.filter(
                ({ key, value }) =>
                  value === PICKUP_IN_POINT_FACET_VALUE ||
                  key === PICKUP_POINT_FACET_KEY
              )

              selectedPickupInPointFacets.length
                ? onDeliveryFacetChange({ facets: selectedPickupInPointFacets })
                : onDeliveryFacetChange({ facet: selectedShippingFacet })
            }

            // Removes pickupInPointIndex from array
            facet.values.splice(pickupInPointFacetIndex, 1)
          }
          // Prevent multiple `pickup in point` facet
          else if (pickupInPointFacetIndex === -1 && defaultPickupPoint) {
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
    defaultPickupPoint,
    pickupPoints,
    selectedFilterFacets,
    onDeliveryFacetChange,
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
          : undefined),
      })
    },
    [postalCode]
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
    defaultPickupPoint,
    selectedPickupPointFacet,
    pickupPointsSimulation,
    clearPickupPointsSimulation,
    fetchingPickupPoints: shouldUpdatePickupPoints,
    changePickupPoint: (pickupPoint: PickupPoint) => {
      deliveryPromiseStore.set({ defaultPickupPoint: pickupPoint })
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
