import deepEquals from 'fast-deep-equal'
import type { Dispatch, PropsWithChildren } from 'react'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'

import { useSession } from 'src/sdk/session'

import {
  deliveryPromiseReducer,
  deliveryPromiseStore,
  getPickupPoints,
  initialPickupPointsSimulation,
  initializeDeliveryPromiseState,
  type DeliveryPromiseReducerAction,
  type DeliveryPromiseReducerState,
} from '.'

type Context = DeliveryPromiseReducerState & {
  dispatchDeliveryPromiseAction: Dispatch<DeliveryPromiseReducerAction>
}

export function pickupLocationKey(
  channel?: string | null,
  country?: string | null
) {
  return `${channel ?? ''}\0${country ?? ''}`
}

/** A cleared update flag still refetches when the shopper channel or country changes. */
export function shouldRefreshPickupPoints(
  postalCode: string | null | undefined,
  shouldUpdatePickupPoints: boolean,
  previousLocationKey: string | null,
  locationKey: string,
  failedLocationKey: string | null = null
) {
  if (!postalCode) {
    return false
  }

  if (shouldUpdatePickupPoints) {
    return true
  }

  if (failedLocationKey === locationKey) {
    return false
  }

  const locationChanged =
    previousLocationKey !== null && previousLocationKey !== locationKey

  return locationChanged
}

export function isCurrentPickupRequest(
  requestId: number,
  latestRequestId: number
) {
  return requestId === latestRequestId
}

const DeliveryPromiseContext = createContext<Context | undefined>(undefined)

export function DeliveryPromiseProvider({
  children,
}: PropsWithChildren<unknown>) {
  const { postalCode, geoCoordinates, country, channel } = useSession()
  const [state, dispatch] = useReducer(
    deliveryPromiseReducer,
    undefined,
    initializeDeliveryPromiseState
  )
  const fetchedLocationKey = useRef<string | null>(null)
  const failedLocationKey = useRef<string | null>(null)
  const pickupRequestId = useRef(0)

  useEffect(() => {
    const locationKey = pickupLocationKey(channel, country)

    if (
      !shouldRefreshPickupPoints(
        postalCode,
        state.shouldUpdatePickupPoints,
        fetchedLocationKey.current,
        locationKey,
        failedLocationKey.current
      )
    ) {
      return
    }

    const currentRequest = ++pickupRequestId.current
    failedLocationKey.current = null

    async function fetchPickupPoints() {
      const simulation = state.simulatePickupPoints
        ? state.pickupPointsSimulation
        : undefined

      try {
        const newPickupPoints = await getPickupPoints({
          geoCoordinates: simulation
            ? (simulation.geoCoordinates ?? null)
            : geoCoordinates,
          postalCode: simulation
            ? (simulation.postalCode ?? postalCode)
            : postalCode,
          country: simulation ? (simulation.country ?? country) : country,
          channel,
        })

        if (!isCurrentPickupRequest(currentRequest, pickupRequestId.current)) {
          return
        }

        fetchedLocationKey.current = locationKey
        applyPickupPoints(newPickupPoints ?? [])
      } catch {
        if (!isCurrentPickupRequest(currentRequest, pickupRequestId.current)) {
          return
        }

        failedLocationKey.current = locationKey
        deliveryPromiseStore.set({
          shouldUpdatePickupPoints: false,
          simulatePickupPoints: false,
        })
      }
    }

    function applyPickupPoints(
      newPickupPoints: NonNullable<Awaited<ReturnType<typeof getPickupPoints>>>
    ) {
      // Pickup points simulation
      if (state.simulatePickupPoints) {
        deliveryPromiseStore.set({
          pickupPointsSimulation: {
            ...state.pickupPointsSimulation,
            pickupPoints: newPickupPoints,
          },
          shouldUpdatePickupPoints: false,
          simulatePickupPoints: false,
        })

        return
      }

      // Prevent reset store after reloading the page
      if (
        state.pickupPoints.length !== 0 &&
        deepEquals(state.pickupPoints, newPickupPoints)
      ) {
        return
      }

      // Check if `changeGlobalPickupPoint` action was already triggered
      // for cases where shopper is changing both postal code and global pickup point
      const isGlobalPickupPointUpdated = newPickupPoints.some(
        ({ id }) => id === state.globalPickupPoint?.id
      )

      deliveryPromiseStore.set({
        globalPickupPoint: isGlobalPickupPointUpdated
          ? state.globalPickupPoint
          : null,
        defaultPickupPoint: null,
        pickupPoints: newPickupPoints,
        pickupPointsSimulation: initialPickupPointsSimulation,
        simulatePickupPoints: false,
        shouldUpdatePickupPoints: false,
      })
    }

    fetchPickupPoints()

    return () => {
      pickupRequestId.current += 1
    }
  }, [state.shouldUpdatePickupPoints, postalCode, channel, country])

  const value = useMemo(
    () => ({
      ...state,
      dispatchDeliveryPromiseAction: dispatch,
    }),
    [state]
  )

  return (
    <DeliveryPromiseContext.Provider value={value}>
      {children}
    </DeliveryPromiseContext.Provider>
  )
}

export function useDeliveryPromiseContext() {
  const context = useContext(DeliveryPromiseContext)

  if (context === undefined) {
    throw new Error('Missing Delivery Promise context on React tree')
  }

  return context
}
