import { useCallback, useEffect, useReducer } from 'react'
import { useSwipeable } from 'react-swipeable'
import type { Dispatch } from 'react'
import type { SwipeableProps } from 'react-swipeable'

export type Direction = 'next' | 'previous'

interface NextPageAction {
  type: 'NEXT_PAGE'
}

interface PreviousPageAction {
  type: 'PREVIOUS_PAGE'
}

interface GoToPageAction {
  type: 'GO_TO_PAGE'
  payload: {
    pageIndex: number
  }
}

interface StopSlideAction {
  type: 'STOP_SLIDE'
}

interface ResetAction {
  type: 'RESET'
  payload: {
    totalItems: number
    itemsPerPage: number
  }
}

export type Action =
  | NextPageAction
  | PreviousPageAction
  | StopSlideAction
  | GoToPageAction
  | ResetAction

export type SliderDispatch = Dispatch<Action>

export interface SliderState {
  /** Current active page */
  currentPage: number
  /** Whether or not the Slider is currently sliding */
  sliding: boolean
  slideDirection: Direction
  totalItems: number
  itemsPerPage: number
  totalPages: number
}

export interface UseSliderArgs extends SwipeableProps {
  totalItems: number
  itemsPerPage?: number
}

export const nextPage = (current: number, total: number) =>
  (current + 1) % total

export const previousPage = (current: number, total: number) =>
  (total - ((total - current + 1) % total)) % total

const defaultState = (
  totalItems: number,
  itemsPerPage: number
): SliderState => ({
  currentPage: 0,
  sliding: false,
  slideDirection: 'next',
  totalItems,
  itemsPerPage,
  totalPages: Math.ceil(totalItems / itemsPerPage),
})

function reducer(state: SliderState, action: Action): SliderState {
  switch (action.type) {
    case 'NEXT_PAGE': {
      return {
        ...state,
        sliding: true,
        slideDirection: 'next',
        currentPage: nextPage(state.currentPage, state.totalPages),
      }
    }

    case 'PREVIOUS_PAGE': {
      return {
        ...state,
        sliding: true,
        slideDirection: 'previous',
        currentPage: previousPage(state.currentPage, state.totalPages),
      }
    }

    case 'GO_TO_PAGE': {
      if (action.payload.pageIndex === state.currentPage) {
        return state
      }

      return {
        ...state,
        sliding: true,
        slideDirection:
          action.payload.pageIndex > state.currentPage ? 'next' : 'previous',
        currentPage: action.payload.pageIndex,
      }
    }

    case 'STOP_SLIDE':
      return { ...state, sliding: false }

    case 'RESET':
      return defaultState(
        action.payload.totalItems,
        action.payload.itemsPerPage
      )

    default:
      return state
  }
}

export default function useSlider({
  totalItems,
  itemsPerPage = 1,
  ...rest
}: UseSliderArgs) {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    defaultState(totalItems, itemsPerPage)
  )

  useEffect(() => {
    if (
      state.totalItems !== totalItems ||
      state.itemsPerPage !== itemsPerPage
    ) {
      dispatch({ type: 'RESET', payload: { totalItems, itemsPerPage } })
    }
  }, [totalItems, itemsPerPage, state.totalItems, state.itemsPerPage])

  const slide = useCallback(
    (page: Direction | number) => {
      if (page === 'next') {
        dispatch({
          type: 'NEXT_PAGE',
        })
      }

      if (page === 'previous') {
        dispatch({
          type: 'PREVIOUS_PAGE',
        })
      }

      if (typeof page === 'number') {
        dispatch({
          type: 'GO_TO_PAGE',
          payload: {
            pageIndex: page,
          },
        })
      }

      setTimeout(() => {
        dispatch({ type: 'STOP_SLIDE' })
      }, 1000)
    },
    [dispatch]
  )

  const handlers = useSwipeable({
    onSwipedRight: () => slide('previous'),
    onSwipedLeft: () => slide('next'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    ...rest,
  })

  return {
    slide,
    state,
    dispatch,
    handlers,
  }
}
