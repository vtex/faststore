import type { ChangeEvent } from 'react'
import { useCallback, useEffect, useReducer } from 'react'

import { useSession } from 'src/sdk/session'

type InputProps = {
  postalCode?: string
  displayClearButton?: boolean
  errorMessage?: string
}

type ShippingOptionProps = {
  carrier: string
  estimate: string
  price: number
}

type ShippingSimulationProps = {
  location?: string
  options?: ShippingOptionProps[]
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

// TODO Remove Mocked data after API integration
const mockShippingOptions: ShippingOptionProps[] = [
  {
    carrier: 'Regular',
    estimate: '12 days',
    price: 21,
  },
  {
    carrier: 'Fedex',
    estimate: '12 days',
    price: 23,
  },
  {
    carrier: 'Same day',
    estimate: '1 day',
    price: 89,
  },
  {
    carrier: 'DHL',
    estimate: '1 day',
    price: 100,
  },
]

const mockShippingSimulation: ShippingSimulationProps = {
  location: 'Street Default — Newark, NY',
  options: mockShippingOptions,
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

export const useShippingSimulation = () => {
  const { postalCode: sessionPostalCode } = useSession()
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
    // TODO update mock after API integration
    dispatch({
      type: 'update',
      payload: {
        input: {
          postalCode: sessionPostalCode,
          displayClearButton: true,
          errorMessage: '',
        },
        shippingSimulation: {
          location: mockShippingSimulation?.location,
          options: mockShippingSimulation?.options ?? [],
        },
      },
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionPostalCode])

  const handleSubmit = useCallback(() => {
    try {
      // TODO update mock after API integration
      dispatch({
        type: 'update',
        payload: {
          input: {
            displayClearButton: true,
            errorMessage: '',
          },
          shippingSimulation: {
            location: `Street from ${shippingPostalCode} Postal Code.`,
            options: mockShippingOptions ?? [],
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
  }, [shippingPostalCode])

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
    dispatch,
    handleSubmit,
    handleOnInput,
  }
}
