/* eslint-disable no-case-declarations */
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

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'addPrev':
      const prev = state[0] - 1

      return [prev, ...state]

    case 'addNext':
      const next = Number(state[state.length - 1]) + 1

      return [...state, next]

    default:
      throw new SDKError('Unknown action for infinite search')
  }
}

export const useSearchInfiniteState = (initialPage: number) => {
  const [pages, dispatch] = useReducer(reducer, initialPage, () => [
    initialPage,
  ])

  return useMemo(
    () => ({
      pages,
      addPrevPage: () => dispatch({ type: 'addPrev' }),
      addNextPage: () => dispatch({ type: 'addNext' }),
    }),
    [pages]
  )
}

export type UseSearchInfiniteState = ReturnType<typeof useSearchInfiniteState>
