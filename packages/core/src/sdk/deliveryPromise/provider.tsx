import type { Dispatch, PropsWithChildren } from 'react'
import {
  useEffect,
  useReducer,
  useMemo,
  createContext,
  useContext,
} from 'react'
import deepEquals from 'fast-deep-equal'

import { useSession } from 'src/sdk/session'

import {
  getPickupPoints,
  deliveryPromiseStore,
  deliveryPromiseReducer,
  initialPickupPointsSimulation,
  initializeDeliveryPromiseState,
  type DeliveryPromiseReducerState,
  type DeliveryPromiseReducerAction,
} from '.'

type Context = DeliveryPromiseReducerState & {
  dispatchDeliveryPromiseAction: Dispatch<DeliveryPromiseReducerAction>
}

const DeliveryPromiseContext = createContext<Context | undefined>(undefined)

export function DeliveryPromiseProvider({
  children,
}: PropsWithChildren<unknown>) {
  const { country, postalCode, geoCoordinates } = useSession()
  const [state, dispatch] = useReducer(
    deliveryPromiseReducer,
    null,
    initializeDeliveryPromiseState
  )

  useEffect(() => {
    if (!postalCode || !state.shouldUpdatePickupPoints) {
      return
    }

    async function fetchPickupPoints() {
      const newPickupPoints = await getPickupPoints({
        country: state.simulatePickupPoints
          ? state.pickupPointsSimulation.country
          : country,
        geoCoordinates: state.simulatePickupPoints
          ? state.pickupPointsSimulation.geoCoordinates
          : geoCoordinates,
        postalCode: state.simulatePickupPoints
          ? state.pickupPointsSimulation.postalCode
          : postalCode,
      })

      // Prevent reseting store if there's already data
      if (
        !state.shouldUpdatePickupPoints &&
        deepEquals(state.pickupPoints, newPickupPoints)
      ) {
        return
      }

      // Pickup points simulation
      if (state.simulatePickupPoints) {
        return deliveryPromiseStore.set({
          pickupPointsSimulation: {
            ...state.pickupPointsSimulation,
            pickupPoints: newPickupPoints,
          },
          shouldUpdatePickupPoints: false,
          simulatePickupPoints: false,
        })
      }

      deliveryPromiseStore.set({
        globalPickupPoint: null,
        selectedPickupPoint: null,
        pickupPoints: newPickupPoints,
        pickupPointsSimulation: initialPickupPointsSimulation,
        simulatePickupPoints: false,
        shouldUpdatePickupPoints: false,
      })
    }

    fetchPickupPoints()
  }, [state.pickupPoints, state.shouldUpdatePickupPoints, postalCode])

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
