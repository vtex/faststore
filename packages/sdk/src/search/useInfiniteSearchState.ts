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

// Save the array containing loaded pages before navigating away from the PLP
function setPagesSessionStorage(pages: number[]) {
  try {
    // Uses the key to identify a PLP
    const stateKey = window.history.state?.key
    if (!stateKey) {
      return
    }
    const storageKey = `__fs_gallery_page_${stateKey}`

    sessionStorage.setItem(storageKey, JSON.stringify(pages))
  } catch (_) {
    return
  }
}

function getPagesFromSessionStorage(): number[] | null {
  try {
    const stateKey = window.history.state?.key
    if (!stateKey) {
      return null
    }
    const storageKey = `__fs_gallery_page_${stateKey}`

    const item = sessionStorage.getItem(storageKey)

    return item ? JSON.parse(item) : null
  } catch (_) {
    return null
  }
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'addPrev': {
      const prev = state[0] - 1
      const newState = [prev, ...state]
      setPagesSessionStorage(newState)
      return newState
    }

    case 'addNext': {
      const next = Number(state[state.length - 1]) + 1
      const newState = [...state, next]
      setPagesSessionStorage(newState)
      return newState
    }

    case 'reset': {
      const { payload } = action
      const newState = [payload]
      setPagesSessionStorage(newState)
      return newState
    }

    default:
      throw new SDKError('Unknown action for infinite search')
  }
}

export const useSearchInfiniteState = (initialPage: number) => {
  const [pages, dispatch] = useReducer(
    reducer,
    undefined,
    () => getPagesFromSessionStorage() ?? [initialPage]
  )

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
