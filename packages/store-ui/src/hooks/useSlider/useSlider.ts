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
   * The `currentSlide` in a Slider with multiple items in a single page is
   * always **the one with the lowest index** in the current page.
   */
  currentSlide: number
  /** Current active page */
  currentPage: number
  /** Whether or not the Slider is currently sliding */
  sliding: boolean
  slideDirection: SlideDirection
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

function reducer(state: SliderState, action: Action): SliderState {
  switch (action.type) {
    case 'NEXT_PAGE': {
      const nextPageIndex = nextPage(state.currentPage, state.totalPages)

      return {
        ...state,
        sliding: true,
        slideDirection: 'next',
        currentSlide: (nextPageIndex % state.totalPages) * state.itemsPerPage,
        currentPage: nextPageIndex,
      }
    }

    case 'PREVIOUS_PAGE': {
      const previousPageIndex = previousPage(
        state.currentPage,
        state.totalPages
      )

      return {
        ...state,
        sliding: true,
        slideDirection: 'previous',
        currentSlide:
          (previousPageIndex % state.totalPages) * state.itemsPerPage,
        currentPage: previousPageIndex,
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
        // Dividing by the total number of pages to make sure `currentSlide`
        // is always <= total number of slides.
        currentSlide:
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
  itemsPerPage: number
): SliderState => ({
  currentSlide: 0,
  currentPage: 0,
  sliding: false,
  slideDirection: 'next',
  totalItems,
  itemsPerPage,
  totalPages: Math.ceil(totalItems / itemsPerPage),
})

const slide = (slideDirection: SlideDirection, dispatch: Dispatch<Action>) => {
  if (slideDirection === 'next') {
    dispatch({
      type: 'NEXT_PAGE',
    })
  }

  if (slideDirection === 'previous') {
    dispatch({
      type: 'PREVIOUS_PAGE',
    })
  }

  setTimeout(() => {
    dispatch({ type: 'STOP_SLIDE' })
  }, 50)
}

export default function useSlider({
  totalItems,
  itemsPerPage = 1,
  ...swipeableConfigOverrides
}: UseSliderArgs) {
  const [sliderState, sliderDispatch] = useReducer(reducer, undefined, () =>
    defaultSliderState(totalItems, itemsPerPage)
  )

  const handlers = useSwipeable({
    onSwipedRight: () => slide('previous', sliderDispatch),
    onSwipedLeft: () => slide('next', sliderDispatch),
    preventDefaultTouchmoveEvent: true,
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
