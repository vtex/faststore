import type { Dispatch, PropsWithChildren } from 'react'
import {
  useEffect,
  useReducer,
  useMemo,
  createContext,
  useContext,
} from 'react'

import { useSession } from 'src/sdk/session'

import { getPickupPoints } from '.'

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

type State = {
  pickupPoints: PickupPoint[]
  selectedPickupPoint?: PickupPoint
  shouldUpdatePickupPoints: boolean
}

type Action =
  | {
      type: 'updatePickupPoints'
      payload: State
    }
  | {
      type: 'changePickupPoint'
      payload: State['selectedPickupPoint']
    }
  | {
      type: 'onPostalCodeChange'
    }
  | {
      type: 'clearDeliveryPromiseState'
      payload: State
    }

const createInitialState = (): State => ({
  pickupPoints: [],
  selectedPickupPoint: undefined,
  shouldUpdatePickupPoints: false,
})

const reducer = (state: State, action: Action): State => {
  const { type } = action

  switch (type) {
    case 'updatePickupPoints': {
      const { payload } = action

      return {
        ...state,
        selectedPickupPoint: undefined,
        pickupPoints: payload.pickupPoints,
        shouldUpdatePickupPoints: payload.shouldUpdatePickupPoints,
      }
    }

    case 'onPostalCodeChange': {
      return {
        ...state,
        selectedPickupPoint: undefined,
        shouldUpdatePickupPoints: true,
      }
    }

    case 'changePickupPoint': {
      const { payload } = action

      return {
        ...state,
        selectedPickupPoint: {
          ...payload,
        },
      }
    }

    case 'clearDeliveryPromiseState': {
      return createInitialState()
    }

    default:
      throw new Error(`Action ${type} not implemented`)
  }
}

type Context = State & {
  dispatchDeliveryPromiseAction: Dispatch<Action>
}

const DeliveryPromiseContext = createContext<Context | undefined>(undefined)

export function DeliveryPromiseProvider({
  children,
}: PropsWithChildren<unknown>) {
  const { country, postalCode, geoCoordinates } = useSession()
  const [state, dispatch] = useReducer(reducer, null, createInitialState)

  useEffect(() => {
    if (!state.shouldUpdatePickupPoints) {
      return
    }

    async function fetchPickupPoints() {
      const newPickupPoints = await getPickupPoints({
        country,
        geoCoordinates,
        postalCode,
      })

      dispatch({
        type: 'updatePickupPoints',
        payload: {
          ...state,
          pickupPoints: newPickupPoints,
          shouldUpdatePickupPoints: false,
        },
      })
    }

    fetchPickupPoints()
  }, [state.shouldUpdatePickupPoints])

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

export function useDeliveryPromise() {
  const context = useContext(DeliveryPromiseContext)

  if (context === undefined) {
    throw new Error('Missing Delivery Promise context on React tree')
  }

  return context
}
