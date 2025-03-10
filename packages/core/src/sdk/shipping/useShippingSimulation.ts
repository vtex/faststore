import type { ClientShippingSimulationQueryQuery } from '@generated/graphql'
import type { ChangeEvent } from 'react'
import { useCallback, useEffect, useReducer, useRef } from 'react'
import getShippingSimulation from '.'
import { useSession } from '../session'

export interface ProductShippingInfo {
  id: string
  seller: string
  quantity: number
}

type InputProps = {
  postalCode?: string
  displayClearButton?: boolean
  errorMessage?: string
}

type State = {
  input: InputProps
  shippingSimulation?: ClientShippingSimulationQueryQuery['shipping']
}

type Action =
  | {
      type: 'update'
      payload: State
    }
  | {
      type: 'onInput'
      payload: InputProps
    }
  | {
      type: 'onError'
      payload: Partial<InputProps>
    }
  | {
      type: 'clear'
    }

const createEmptySimulation = () =>
  ({
    input: {
      postalCode: '',
      displayClearButton: false,
      errorMessage: '',
    },
    shippingSimulation: undefined,
  }) as State

const reducer = (state: State, action: Action) => {
  const { type } = action

  switch (type) {
    case 'clear': {
      return createEmptySimulation()
    }

    case 'update': {
      const { payload } = action

      return {
        input: {
          ...state.input,
          ...payload.input,
        },
        shippingSimulation: {
          ...state.shippingSimulation,
          ...payload.shippingSimulation,
        },
      }
    }

    case 'onInput': {
      const { payload } = action

      return {
        ...state,
        input: {
          ...payload,
        },
      }
    }

    case 'onError': {
      const { payload } = action

      return {
        ...state,
        input: {
          ...state.input,
          ...payload,
        },
      }
    }

    default:
      throw new Error(`Action ${type} not implemented`)
  }
}

export const useShippingSimulation = (shippingItem: ProductShippingInfo) => {
  const [{ input, shippingSimulation }, dispatch] = useReducer(
    reducer,
    null,
    createEmptySimulation
  )

  const { country, postalCode: sessionPostalCode } = useSession()
  const { postalCode: shippingPostalCode } = input
  const shippingPostalCodeRef = useRef(shippingPostalCode)
  /**
   * Internally useEffect compares the dependencies by reference - it's a problem when there is an object.
   * Stringifying the object to compare it by value avoids calling useEffect multiple times
   * when there is no change in the dependencies.
   */
  const shippingItemJson = JSON.stringify(shippingItem)

  useEffect(() => {
    const shippingItemParsed = JSON.parse(shippingItemJson)
    const shouldFetch = sessionPostalCode && !shippingPostalCodeRef.current
    if (!shouldFetch) {
      return
    }

    // Use sessionPostalCode if there is no shippingPostalCode
    async function fetchShipping() {
      const data = await getShippingSimulation({
        country,
        postalCode: sessionPostalCode ?? '',
        items: [shippingItemParsed],
      })
      const shippingSimulation = data.shipping

      dispatch({
        type: 'update',
        payload: {
          input: {
            postalCode: sessionPostalCode ?? '',
            displayClearButton: true,
            errorMessage: '',
          },
          shippingSimulation,
        },
      })
    }

    fetchShipping()
  }, [country, sessionPostalCode, shippingItemJson])

  const handleSubmit = useCallback(async () => {
    try {
      const data = await getShippingSimulation({
        country,
        postalCode: shippingPostalCode ?? '',
        items: [shippingItem],
      })
      const shippingSimulation = data.shipping

      dispatch({
        type: 'update',
        payload: {
          input: {
            displayClearButton: true,
            errorMessage: '',
          },
          shippingSimulation,
        },
      })
    } catch (error) {
      dispatch({
        type: 'onError',
        payload: {
          displayClearButton: true,
          errorMessage: 'You entered an invalid Postal Code',
        },
      })
    }
  }, [country, shippingItem, shippingPostalCode])

  const handleOnInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.currentTarget.value

    if (currentValue) {
      dispatch({
        type: 'onInput',
        payload: {
          postalCode: currentValue,
          displayClearButton: false,
          errorMessage: '',
        },
      })
    } else {
      dispatch({
        type: 'clear',
      })
    }
  }, [])

  return {
    input,
    shippingSimulation,
    handleOnClear: () => {
      dispatch({ type: 'clear' })
    },
    handleSubmit,
    handleOnInput,
  }
}
