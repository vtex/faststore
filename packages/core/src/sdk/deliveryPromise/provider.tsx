import deepEquals from 'fast-deep-equal'
import type { Dispatch, PropsWithChildren } from 'react'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'

import { useSession } from '../session'

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

const DeliveryPromiseContext = createContext<Context | undefined>(undefined)

export function DeliveryPromiseProvider({
  children,
}: PropsWithChildren<unknown>) {
  const { postalCode, geoCoordinates } = useSession()
  const [state, dispatch] = useReducer(
    deliveryPromiseReducer,
    undefined,
    initializeDeliveryPromiseState
  )

  useEffect(() => {
    if (!postalCode || !state.shouldUpdatePickupPoints) {
      return
    }

    async function fetchPickupPoints() {
      const newPickupPoints = await getPickupPoints({
        geoCoordinates:
          state.simulatePickupPoints &&
          state.pickupPointsSimulation?.geoCoordinates
            ? state.pickupPointsSimulation.geoCoordinates
            : geoCoordinates,
      })

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
  }, [state.shouldUpdatePickupPoints, postalCode])

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
