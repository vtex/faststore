import type { Session } from '@faststore/sdk'

import { deliveryPromiseStore, type PickupPoint } from '.'

export type PickupPointsSimulation = {
  pickupPoints?: PickupPoint[]
  country: Session['country'] | null
  postalCode: Session['postalCode'] | null
  geoCoordinates: Session['geoCoordinates'] | null
}

export const initialPickupPointsSimulation: PickupPointsSimulation = {
  pickupPoints: [],
  country: null,
  postalCode: null,
  geoCoordinates: null,
}

export type DeliveryPromiseReducerState = {
  pickupPoints?: PickupPoint[]
  selectedPickupPoint?: PickupPoint
  globalPickupPoint?: PickupPoint
  shouldUpdatePickupPoints?: boolean
  simulatePickupPoints?: boolean
  pickupPointsSimulation?: PickupPointsSimulation
}

export type DeliveryPromiseReducerAction =
  | {
      type: 'updatePickupPoints'
      payload: DeliveryPromiseReducerState
    }
  | {
      type: 'changePickupPoint'
      payload: DeliveryPromiseReducerState['selectedPickupPoint']
    }
  | {
      type: 'changeGlobalPickupPoint'
      payload: DeliveryPromiseReducerState['globalPickupPoint']
    }
  | {
      type: 'onPostalCodeChange'
      payload?: {
        simulatePickupPoints: DeliveryPromiseReducerState['simulatePickupPoints']
        validatedSession: Partial<Session>
      }
    }
  | {
      type: 'updateDeliveryPromiseState'
      payload: DeliveryPromiseReducerState
    }
  | {
      type: 'clearPickupPointsSimulation'
    }

export const initializeDeliveryPromiseState =
  (): DeliveryPromiseReducerState => ({
    pickupPoints: [],
    selectedPickupPoint: null,
    globalPickupPoint: null,
    shouldUpdatePickupPoints: false,
    simulatePickupPoints: false,
    pickupPointsSimulation: initialPickupPointsSimulation,
  })

export const deliveryPromiseReducer = (
  state: DeliveryPromiseReducerState,
  action: DeliveryPromiseReducerAction
): DeliveryPromiseReducerState => {
  const { type } = action

  switch (type) {
    case 'updatePickupPoints': {
      const { payload } = action

      return {
        ...state,
        selectedPickupPoint: null,
        globalPickupPoint: null,
        pickupPoints: payload.pickupPoints,
        shouldUpdatePickupPoints: payload.shouldUpdatePickupPoints,
      }
    }

    case 'onPostalCodeChange': {
      if (action.payload) {
        const {
          payload: { simulatePickupPoints, validatedSession },
        } = action

        return {
          ...state,
          simulatePickupPoints,
          pickupPointsSimulation: {
            ...state.pickupPointsSimulation,
            country: validatedSession.country,
            postalCode: validatedSession.postalCode,
            geoCoordinates: validatedSession.geoCoordinates,
          },
          shouldUpdatePickupPoints: true,
        }
      }

      return {
        ...state,
        selectedPickupPoint: null,
        globalPickupPoint: null,
        pickupPointsSimulation: initialPickupPointsSimulation,
        shouldUpdatePickupPoints: true,
      }
    }

    case 'changePickupPoint': {
      const { payload } = action

      return { ...state, selectedPickupPoint: payload }
    }

    case 'changeGlobalPickupPoint': {
      const { payload } = action

      return { ...state, globalPickupPoint: payload }
    }

    case 'updateDeliveryPromiseState': {
      const { payload } = action

      return {
        ...state,
        ...payload,
      }
    }

    case 'clearPickupPointsSimulation': {
      return {
        ...state,
        simulatePickupPoints: false,
        pickupPointsSimulation: initialPickupPointsSimulation,
      }
    }

    default:
      throw new Error(`Action ${type} not implemented`)
  }
}
