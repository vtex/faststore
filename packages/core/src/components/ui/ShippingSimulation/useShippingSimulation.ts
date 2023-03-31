import type { ChangeEvent } from 'react'
import { useCallback, useEffect, useReducer } from 'react'
import { ShippingSimulationProps as UIShippingSimulationProps } from '@faststore/components'

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

type ShippingSimulationProps = {
  location?: string
  options?: UIShippingSimulationProps['options']
}

type State = {
  input: InputProps
  shippingSimulation: ShippingSimulationProps
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

const createEmptySimulation = () => ({
  input: {
    postalCode: '',
    displayClearButton: false,
    errorMessage: '',
  },
  shippingSimulation: {
    location: '',
    options: [],
  },
})

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

export type FetchShippingSimulation = (
  shippingItem: ProductShippingInfo,
  country: string,
  postalCode: string
) => Promise<[string, UIShippingSimulationProps['options']]>

export const useShippingSimulation = (
  shippingItem: ProductShippingInfo,
  fetchShippingSimulationFn: FetchShippingSimulation,
  sessionPostalCode: string,
  country: string
) => {
  const [{ input, shippingSimulation }, dispatch] = useReducer(
    reducer,
    null,
    createEmptySimulation
  )

  const { postalCode: shippingPostalCode } = input

  useEffect(() => {
    if (!sessionPostalCode || shippingPostalCode) {
      return
    }

    // Use sessionPostalCode if there is no shippingPostalCode
    async function fetchShipping() {
      const [location, options] = await fetchShippingSimulationFn(
        shippingItem,
        country,
        sessionPostalCode ?? ''
      )

      dispatch({
        type: 'update',
        payload: {
          input: {
            postalCode: sessionPostalCode ?? '',
            displayClearButton: true,
            errorMessage: '',
          },
          shippingSimulation: {
            location,
            options,
          },
        },
      })
    }

    fetchShipping()
  }, [
    country,
    fetchShippingSimulationFn,
    sessionPostalCode,
    shippingItem,
    shippingPostalCode,
  ])

  const handleSubmit = useCallback(async () => {
    try {
      const [location, options] = await fetchShippingSimulationFn(
        shippingItem,
        country,
        shippingPostalCode ?? ''
      )

      dispatch({
        type: 'update',
        payload: {
          input: {
            displayClearButton: true,
            errorMessage: '',
          },
          shippingSimulation: {
            location,
            options,
          },
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
  }, [country, fetchShippingSimulationFn, shippingItem, shippingPostalCode])

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
