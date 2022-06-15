import { useMemo, useReducer } from 'react'

import { SDKError } from '../utils/error'

type State = number[]

type Action =
  | {
      type: 'addPrev'
    }
  | {
      type: 'addNext'
    }
  | {
      type: 'reset'
      payload: number
    }

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'addPrev': {
      const prev = state[0] - 1

      return [prev, ...state]
    }

    case 'addNext': {
      const next = Number(state[state.length - 1]) + 1

      return [...state, next]
    }

    case 'reset': {
      const { payload } = action

      return [payload]
    }

    default:
      throw new SDKError('Unknown action for infinite search')
  }
}

export const useSearchInfiniteState = (initialPage: number) => {
  const [pages, dispatch] = useReducer(reducer, undefined, () => [initialPage])

  const actions = useMemo(
    () => ({
      addPrevPage: () => dispatch({ type: 'addPrev' }),
      addNextPage: () => dispatch({ type: 'addNext' }),
      resetInfiniteScroll: (page: number) =>
        dispatch({ type: 'reset', payload: page }),
    }),
    []
  )

  return { pages, ...actions }
}

export type UseSearchInfiniteState = ReturnType<typeof useSearchInfiniteState>
