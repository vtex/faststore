import deepEquals from 'fast-deep-equal'
import { useCallback, useEffect, useMemo } from 'react'

import {
  createStore,
  toggleFacets,
  useSearch,
  type SearchState,
  type Session,
} from '@faststore/sdk'
import type {
  DeliveryPromiseBadge,
  Filter_FacetsFragment,
} from '@generated/graphql'
import type { useFilter } from 'src/sdk/search/useFilter'
import { useSession } from 'src/sdk/session'
import type { GlobalCmsData } from 'src/utils/globalSettings'

import { deliveryPromise as deliveryPromiseConfig } from 'discovery.config'
import {
  initialPickupPointsSimulation,
  useDeliveryPromiseContext,
  type PickupPointsSimulation,
} from '.'

export const PICKUP_POINT_FACET_KEY = 'pickupPoint' as const
export const SHIPPING_FACET_KEY = 'shipping' as const
export const PICKUP_IN_POINT_FACET_VALUE = 'pickup-in-point' as const
export const ALL_DELIVERY_METHODS_FACET_VALUE = 'all-delivery-methods' as const
export const PICKUP_ALL_FACET_VALUE = 'pickup-all' as const
export const ALL_DELIVERY_OPTIONS_FACET_VALUE = 'all-delivery-options' as const
export const DELIVERY_OPTIONS_FACET_KEY = 'delivery-options' as const
export const DYNAMIC_ESTIMATE_FACET_KEY = 'dynamic-estimate' as const

type Facet = SearchState['selectedFacets'][number]
type DeliveryType = 'delivery' | 'pickup-in-point'

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
  deliveryPromiseSettings?: GlobalCmsData['deliveryPromise']
  allFacets?: ReturnType<typeof useFilter>['facets']
  fallbackToFirstPickupPoint?: boolean
  selectedFilterFacets?: Facet[]
  deliveryPromiseBadges?: DeliveryPromiseBadge[]
}

/**
 * @param fallbackToFirstPickupPoint When true, the first available pickup point will be used as the pickup-in-point facet
 * when the shopper has not yet explicitly chosen a pickup point.
 */
export function useDeliveryPromise({
  allFacets,
  selectedFilterFacets = undefined,
  deliveryPromiseSettings,
  fallbackToFirstPickupPoint = true,
  deliveryPromiseBadges,
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
  } = useDeliveryPromiseContext()

  const isDeliveryPromiseEnabled = deliveryPromiseConfig.enabled
  const isDeliveryOptionsEnabled =
    deliveryPromiseSettings?.deliveryOptions?.enabled ?? true

  const selectedFacets = useMemo(
    () => selectedFilterFacets ?? searchState.selectedFacets,
    [selectedFilterFacets, searchState.selectedFacets]
  )
  const selectedPickupPointFacet = useMemo(
    () =>
      selectedFacets.find(({ key }) => key === PICKUP_POINT_FACET_KEY)?.value,
    [selectedFacets]
  )

  // Update Delivery Promise global state after store changes
  useEffect(() => {
    const unsubscribers = [
      deliveryPromiseStore.subscribe((storeValue) => {
        dispatchDeliveryPromiseAction({
          type: 'updateDeliveryPromiseState',
          payload: storeValue,
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

  // Validate if should select the global pickup point facet in the first load
  useEffect(() => {
    const hasShippingFacetSelected = selectedFacets.some(
      ({ key }) => key === SHIPPING_FACET_KEY
    )
    const shouldSelectGlobalPickupPoint =
      !!globalPickupPoint && !hasShippingFacetSelected

    if (shouldSelectGlobalPickupPoint) {
      setSearchState({
        selectedFacets: toggleFacets(
          selectedFacets,
          [
            { key: SHIPPING_FACET_KEY, value: PICKUP_IN_POINT_FACET_VALUE },
            {
              key: PICKUP_POINT_FACET_KEY,
              value: globalPickupPoint.id,
            },
          ],
          true
        ),
        page: 0,
      })
    }
  }, [])

  const pickupPointByID = useCallback(
    (pickupPointId: string) => {
      if (!pickupPoints?.length) return

      const preferredPickupPoint =
        pickupPoints?.find(({ id }) => id === pickupPointId) ??
        defaultPickupPoint ??
        globalPickupPoint

      if (fallbackToFirstPickupPoint && !preferredPickupPoint) {
        return pickupPoints[0]
      }

      return preferredPickupPoint
    },
    [pickupPoints, defaultPickupPoint, globalPickupPoint]
  )

  const pickupInPointFacet = useMemo(
    () => ({
      value: PICKUP_IN_POINT_FACET_VALUE,
      label: defaultPickupPoint?.name ?? defaultPickupPoint?.address.street,
      selected: selectedFacets?.some(
        ({ key, value }) =>
          value === PICKUP_IN_POINT_FACET_VALUE ||
          key === PICKUP_POINT_FACET_KEY
      ),
      quantity: defaultPickupPoint?.totalItems,
    }),
    [defaultPickupPoint, selectedFacets]
  )

  const [allDeliveryMethodsFacet, allDeliveryOptionsFacet] = useMemo(
    () => [
      {
        value: ALL_DELIVERY_METHODS_FACET_VALUE,
        label:
          deliveryPromiseSettings?.deliveryMethods?.allDeliveryMethods ??
          'All delivery methods',
        selected:
          !selectedFacets.some(({ key }) => key === SHIPPING_FACET_KEY) ||
          selectedFacets?.some(
            ({ key, value }) =>
              key === SHIPPING_FACET_KEY &&
              value === ALL_DELIVERY_METHODS_FACET_VALUE
          ),
        quantity: 0,
      },
      {
        value: ALL_DELIVERY_OPTIONS_FACET_VALUE,
        label:
          deliveryPromiseSettings?.deliveryOptions?.allDeliveryOptions ??
          'All delivery options',
        selected:
          !selectedFacets.some(
            ({ key }) => key === DELIVERY_OPTIONS_FACET_KEY
          ) ||
          selectedFacets?.some(
            ({ key, value }) =>
              key === DELIVERY_OPTIONS_FACET_KEY &&
              value === ALL_DELIVERY_OPTIONS_FACET_VALUE
          ),
        quantity: 0,
      },
    ],
    [selectedFacets, deliveryPromiseSettings, pickupInPointFacet]
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
      let currentSelectedFacets = selectedFacets

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
        selectedFacets: toggleFacets(
          currentSelectedFacets,
          facetsToToggle,
          unique
        ),
        page: 0,
      })
    },
    [selectedFacets, defaultPickupPoint]
  )

  const facets = useMemo(() => {
    if (!allFacets) return []

    return !isDeliveryPromiseEnabled || !postalCode
      ? allFacets.filter(({ key }) => key !== SHIPPING_FACET_KEY)
      : allFacets
          .map((facet) => {
            if (facet.__typename !== 'StoreFacetBoolean') return facet

            if (facet.key === DELIVERY_OPTIONS_FACET_KEY) {
              facet.values = withUniqueFacet(
                facet.values,
                allDeliveryOptionsFacet
              )

              return facet
            }

            if (facet.key !== SHIPPING_FACET_KEY) return facet

            facet.values = withUniqueFacet(
              facet.values,
              allDeliveryMethodsFacet
            )
            const pickupInPointFacetIndex = facet.values.findIndex(
              (item) => item?.value === PICKUP_IN_POINT_FACET_VALUE
            )

            // Remove old pickup `pickup in point` facet from list and search state
            if (pickupInPointFacetIndex !== -1 && !defaultPickupPoint) {
              const selectedShippingFacet = selectedFacets.find(
                ({ key }) => key === SHIPPING_FACET_KEY
              )

              if (selectedShippingFacet) {
                const selectedPickupInPointFacets = selectedFacets.filter(
                  ({ key, value }) =>
                    value === PICKUP_IN_POINT_FACET_VALUE ||
                    key === PICKUP_POINT_FACET_KEY
                )

                selectedPickupInPointFacets.length
                  ? onDeliveryFacetChange({
                      facets: selectedPickupInPointFacets,
                    })
                  : onDeliveryFacetChange({ facet: selectedShippingFacet })
              }

              // Removes pickupInPointIndex from array
              facet.values = facet.values.filter(
                (_, index) => index !== pickupInPointFacetIndex
              )
            }
            // Prevent multiple `pickup in point` facet
            else if (pickupInPointFacetIndex === -1 && defaultPickupPoint) {
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

            facet.values = facet.values.sort((a, b) =>
              (a.value ?? '').localeCompare(b.value ?? '')
            )

            return facet
          })
          .sort((a, b) => {
            // Define priority order: shipping (0), delivery-options (1), others (2)
            const getPriority = (key: string) => {
              if (key === SHIPPING_FACET_KEY) return 0
              if (key === DELIVERY_OPTIONS_FACET_KEY) return 1
              return 2
            }

            return getPriority(a.key) - getPriority(b.key)
          })
  }, [
    allDeliveryMethodsFacet,
    pickupInPointFacet,
    allFacets,
    defaultPickupPoint,
    globalPickupPoint,
    pickupPoints,
    selectedFacets,
    onDeliveryFacetChange,
    selectedPickupPointFacet,
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
    []
  )

  const clearPickupPointsSimulation = useCallback(
    () =>
      deliveryPromiseStore.set({
        pickupPointsSimulation: initialPickupPointsSimulation,
      }),
    []
  )

  function getBadgeLabel(value: DeliveryType, isAvailable: boolean) {
    const labelMap: Record<
      DeliveryType,
      { available: string; unavailable: string }
    > = {
      delivery: {
        available:
          deliveryPromiseSettings?.deliveryPromiseBadges?.delivery ??
          'Available for shipping',
        unavailable:
          deliveryPromiseSettings?.deliveryPromiseBadges?.deliveryUnavailable ??
          'Unavailable for shipping',
      },
      'pickup-in-point': {
        available:
          deliveryPromiseSettings?.deliveryPromiseBadges?.pickupInPoint ??
          'Available for pickup',
        unavailable:
          deliveryPromiseSettings?.deliveryPromiseBadges
            ?.pickupInPointUnavailable ?? 'Unavailable for pickup',
      },
    }

    return labelMap[value]
      ? isAvailable
        ? labelMap[value].available
        : labelMap[value].unavailable
      : value
  }

  function getDeliveryPromiseBadges() {
    // Only add unavailable badges if at least one delivery method is available
    if (!deliveryPromiseBadges || deliveryPromiseBadges.length === 0) return []

    const badges: Array<{ label: string; availability: boolean }> = []

    const availableTypeNames = deliveryPromiseBadges?.map(
      (badge) => badge.typeName
    )

    const hasDelivery = availableTypeNames?.includes('delivery')
    const hasPickupPoint = availableTypeNames?.includes('pickup-in-point')

    if (hasDelivery) {
      badges.push({
        label: getBadgeLabel('delivery', true),
        availability: true,
      })
    } else {
      badges.push({
        label: getBadgeLabel('delivery', false),
        availability: false,
      })
    }

    if (hasPickupPoint) {
      badges.push({
        label: getBadgeLabel('pickup-in-point', true),
        availability: true,
      })
    } else {
      badges.push({
        label: getBadgeLabel('pickup-in-point', false),
        availability: false,
      })
    }

    return badges
  }

  const badges = getDeliveryPromiseBadges()

  const shouldDisplayDeliveryPromiseBadges =
    !!postalCode &&
    isDeliveryPromiseEnabled &&
    (deliveryPromiseSettings?.deliveryPromiseBadges?.enabled ?? true) &&
    badges.length > 0

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
    deliveryLabel:
      deliveryPromiseSettings?.deliveryMethods?.title ?? 'Delivery',
    deliveryOptionsLabel:
      deliveryPromiseSettings?.deliveryOptions?.title ?? 'Delivery Option',
    isPickupAllEnabled:
      pickupPoints?.length > 0 &&
      (deliveryPromiseSettings?.deliveryMethods?.pickupAll?.enabled ?? false),
    shouldDisplayDeliveryButton: isDeliveryPromiseEnabled && !postalCode,
    shouldDisplayDeliveryPromiseBadges,
    badges,
  }
}

type BoleanFacet = Extract<
  Filter_FacetsFragment,
  { __typename: 'StoreFacetBoolean' }
>['values'][number]

function withUniqueFacet(facets: Array<BoleanFacet>, facet: BoleanFacet) {
  return [facet, ...facets.filter((item) => item.value !== facet.value)]
}

const RADIO_FACETS = ['shipping', 'pickupPoint', 'delivery-options'] as const
function isRadioFacet(facet: unknown): facet is (typeof RADIO_FACETS)[number] {
  if (typeof facet !== 'string') return false

  return RADIO_FACETS.some((el) => el === facet)
}
