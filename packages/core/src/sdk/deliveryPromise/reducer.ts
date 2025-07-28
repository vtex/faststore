import type { Session } from '@faststore/sdk'

import type { PickupPoint } from '.'

export type PickupPointsSimulation = {
  pickupPoints?: PickupPoint[]
  geoCoordinates: Session['geoCoordinates'] | null
}

export const initialPickupPointsSimulation: PickupPointsSimulation = {
  pickupPoints: [],
  geoCoordinates: null,
}

export type DeliveryPromiseReducerState = {
  pickupPoints?: PickupPoint[]
  defaultPickupPoint?: PickupPoint
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
      payload: DeliveryPromiseReducerState['defaultPickupPoint']
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
    defaultPickupPoint: null,
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
        defaultPickupPoint: null,
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
            geoCoordinates: validatedSession.geoCoordinates,
          },
          shouldUpdatePickupPoints: true,
        }
      }

      return {
        ...state,
        pickupPointsSimulation: initialPickupPointsSimulation,
        shouldUpdatePickupPoints: true,
      }
    }

    case 'changePickupPoint': {
      const { payload } = action

      return { ...state, defaultPickupPoint: payload }
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
