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

export interface CarouselState {
  /**
   * The `currentSlide` in a Carousel with multiple items in a single page is
   * always **the one with the lowest index** in the current page.
   */
  currentSlide: number
  /** Current active page */
  currentPage: number
  /** Whether or not the Carousel is currently sliding */
  sliding: boolean
  slideDirection: SlideDirection
  totalItems: number
  itemsPerPage: number
  totalPages: number
}

export interface UseCarouselArgs {
  totalItems: number
  itemsPerPage?: number
  swipeableConfigOverrides?: SwipeableProps
}

function reducer(state: CarouselState, action: Action): CarouselState {
  switch (action.type) {
    case 'NEXT_PAGE': {
      let nextSlide = state.currentSlide + state.itemsPerPage
      let nextPage = state.currentPage + 1

      if (nextSlide >= state.totalItems) {
        nextSlide = 0
      }

      if (nextPage >= state.totalPages) {
        nextPage = 0
      }

      return {
        ...state,
        sliding: true,
        slideDirection: 'next',
        currentSlide: nextSlide,
        currentPage: nextPage,
      }
    }

    case 'PREVIOUS_PAGE': {
      let previousSlide = state.currentSlide - state.itemsPerPage
      let previousPage = state.currentPage - 1

      if (previousSlide < 0) {
        previousSlide = state.totalItems - state.itemsPerPage + 1
      }

      if (previousPage < 0) {
        previousPage = state.totalPages - 1
      }

      return {
        ...state,
        sliding: true,
        slideDirection: 'previous',
        currentSlide: previousSlide,
        currentPage: previousPage,
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

const defaultCarouselState = (
  totalItems: number,
  itemsPerPage: number
): CarouselState => ({
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

export default function useCarousel({
  totalItems,
  swipeableConfigOverrides,
  itemsPerPage = 1,
}: UseCarouselArgs) {
  const [carouselState, carouselDispatch] = useReducer(
    reducer,
    defaultCarouselState(totalItems, itemsPerPage)
  )

  const handlers = useSwipeable({
    onSwipedRight: () => slide('previous', carouselDispatch),
    onSwipedLeft: () => slide('next', carouselDispatch),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    ...swipeableConfigOverrides,
  })

  return { handlers, slide, carouselState, carouselDispatch }
}
