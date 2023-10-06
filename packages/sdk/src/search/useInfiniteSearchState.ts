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

function setPagesSessionStorage(pagesArray: number[]) {
  try {
    const stateKey = window.history.state?.key

    sessionStorage.setItem(
      `__fs_gallery_pages_${stateKey}`,
      JSON.stringify(pagesArray)
    )
  } catch (error) {
    return
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

function retrievePagesFromSessionStorage(): number[] | null {

  try {
    const stateKey = window.history.state?.key
    const item = sessionStorage.getItem(`__fs_gallery_pages_${stateKey}`)
    if (!item) {
      return null
    }
    console.log(item)
    return JSON.parse(item)
  } catch (error) {
    return null
  }
}

export const useSearchInfiniteState = (initialPage: number) => {
  const [pages, dispatch] = useReducer(
    reducer,
    undefined,
    () => retrievePagesFromSessionStorage() ?? [initialPage]
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
