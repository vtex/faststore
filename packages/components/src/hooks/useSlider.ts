import type { Dispatch } from 'react'
import { useReducer } from 'react'
import type { SwipeableProps } from 'react-swipeable'
import { useSwipeable } from 'react-swipeable'

export type SlideDirection = 'next' | 'previous'

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
    shouldSlide: boolean
  }
}

interface StopSlideAction {
  type: 'STOP_SLIDE'
}

export type Action =
  | NextPageAction
  | PreviousPageAction
  | StopSlideAction
  | GoToPageAction

export type SliderDispatch = Dispatch<Action>

export interface SliderState {
  /**
   * The `currentItem` in a Slider with multiple items in a single page is
   * always **the one with the lowest index** in the current page.
   */
  currentItem: number
  /** Currently active page */
  currentPage: number
  /**
   * Whether or not the Slider is currently sliding. This is useful to
   * manipulate the `transition` property in a component.
   */
  sliding: boolean
  /** The direction in which the Slider is sliding. */
  slideDirection: SlideDirection
  /** The total number of unique items in the slider. */
  totalItems: number
  /** The number of items in a single page. */
  itemsPerPage: number
  /** The total number of pages in the slider. */
  totalPages: number
  /** Whether or not the slider is infinite. */
  infinite: boolean
}

export const nextPage = (current: number, total: number) =>
  (current + 1) % total

export const previousPage = (current: number, total: number) =>
  (total - ((total - current + 1) % total)) % total

function reducer(state: SliderState, action: Action): SliderState {
  switch (action.type) {
    case 'NEXT_PAGE': {
      // If `state.infinite` is true, we need to take into account an extra
      // page in the calculation. This extra page is a clone of the first page.
      const adjustedTotalPages = state.infinite
        ? state.totalPages + 1
        : state.totalPages

      const nextPageIndex = nextPage(state.currentPage, adjustedTotalPages)

      const nextItemIndex =
        (nextPageIndex % adjustedTotalPages) * state.itemsPerPage

      return {
        ...state,
        sliding: true,
        slideDirection: 'next',
        currentItem: nextItemIndex,
        currentPage: nextPageIndex,
      }
    }

    case 'PREVIOUS_PAGE': {
      // If `state.infinite` is true, we need to take into account an extra
      // page in the calculation. This extra page is a clone of the first page.
      const adjustedTotalPages = state.infinite
        ? state.totalPages + 1
        : state.totalPages

      // If `state.infinite` is true and we're currently on page 0, we need to
      // let the slider go to page -1. This -1 page is a clone of the last page.
      const shouldGoToClone = state.infinite && state.currentPage === 0
      const previousPageIndex = shouldGoToClone
        ? -1
        : previousPage(state.currentPage, state.totalPages)

      return {
        ...state,
        sliding: true,
        slideDirection: 'previous',
        currentItem:
          (previousPageIndex % adjustedTotalPages) * state.itemsPerPage,
        currentPage: previousPageIndex,
      }
    }

    case 'GO_TO_PAGE': {
      if (action.payload.pageIndex === state.currentPage) {
        return state
      }

      return {
        ...state,
        sliding: action.payload.shouldSlide,
        slideDirection:
          action.payload.pageIndex > state.currentPage ? 'next' : 'previous',
        currentItem:
          (action.payload.pageIndex % state.totalPages) * state.itemsPerPage,
        currentPage: action.payload.pageIndex,
      }
    }

    case 'STOP_SLIDE':
      return { ...state, sliding: false }

    default:
      return state
  }
}

const defaultSliderState = (
  totalItems: number,
  itemsPerPage: number,
  infinite: boolean
): SliderState => ({
  currentItem: 0,
  currentPage: 0,
  sliding: false,
  slideDirection: 'next',
  totalItems,
  itemsPerPage,
  totalPages: Math.ceil(totalItems / itemsPerPage),
  infinite,
})

const slide = (page: SlideDirection | number, dispatch: Dispatch<Action>) => {
  if (page === 'next') {
    dispatch({ type: 'NEXT_PAGE' })
  }

  if (page === 'previous') {
    dispatch({ type: 'PREVIOUS_PAGE' })
  }

  if (typeof page === 'number') {
    dispatch({
      type: 'GO_TO_PAGE',
      payload: {
        pageIndex: page,
        shouldSlide: true,
      },
    })
  }
}

export interface UseSliderArgs extends SwipeableProps {
  /** The total number of unique items in the slider. */
  totalItems: number
  /** The number of items in a single slider page. */
  itemsPerPage?: number
  /** Whether or not the slider is infinite. */
  infiniteMode?: boolean
  /**  Whether or not slide after swiping left/right. */
  shouldSlideOnSwipe?: boolean
}

export const useSlider = ({
  totalItems,
  itemsPerPage = 1,
  infiniteMode = false,
  shouldSlideOnSwipe = true,
  ...swipeableConfigOverrides
}: UseSliderArgs) => {
  const [sliderState, sliderDispatch] = useReducer(reducer, undefined, () =>
    defaultSliderState(totalItems, itemsPerPage, infiniteMode)
  )

  const handlers = useSwipeable({
    onSwipedRight: () =>
      shouldSlideOnSwipe && slide('previous', sliderDispatch),
    onSwipedLeft: () => shouldSlideOnSwipe && slide('next', sliderDispatch),
    trackMouse: true,
    ...swipeableConfigOverrides,
  })

  return {
    handlers,
    slide,
    sliderState,
    sliderDispatch,
  }
}
