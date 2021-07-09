import { useReducer } from 'react'
import type { SwipeableProps } from 'react-swipeable'
import { useSwipeable } from 'react-swipeable'

type SlideDirection = 'next' | 'previous'

interface NextSlideAction {
  type: 'NEXT_SLIDE'
}

interface PreviousSlideAction {
  type: 'PREVIOUS_SLIDE'
}

interface GoToSlideAction {
  type: 'GO_TO_SLIDE'
  payload: {
    slideIndex: number
  }
}

interface UpdateNumberOfItemsAction {
  type: 'UPDATE_NUMBER_OF_ITEMS'
  payload: {
    newValue: number
  }
}

interface StopSlideAction {
  type: 'STOP_SLIDE'
}

type Action =
  | NextSlideAction
  | PreviousSlideAction
  | StopSlideAction
  | UpdateNumberOfItemsAction
  | GoToSlideAction

interface CarouselState {
  currentPosition: number
  sliding: boolean
  slideDirection: SlideDirection
  numberOfItems: number
}

interface UseCarouselArgs {
  numberOfItems: number
  swipeableConfigOverrides?: SwipeableProps
}

function reducer(state: CarouselState, action: Action): CarouselState {
  switch (action.type) {
    case 'NEXT_SLIDE':
      return {
        ...state,
        sliding: true,
        slideDirection: 'next',
        currentPosition:
          state.currentPosition === state.numberOfItems - 1
            ? 0
            : state.currentPosition + 1,
      }

    case 'PREVIOUS_SLIDE':
      return {
        ...state,
        sliding: true,
        slideDirection: 'previous',
        currentPosition:
          state.currentPosition === 0
            ? state.numberOfItems - 1
            : state.currentPosition - 1,
      }

    case 'GO_TO_SLIDE':
      return {
        ...state,
        sliding: true,
        slideDirection:
          action.payload.slideIndex > state.currentPosition
            ? 'next'
            : 'previous',
        currentPosition: action.payload.slideIndex,
      }

    case 'STOP_SLIDE':
      return { ...state, sliding: false }

    case 'UPDATE_NUMBER_OF_ITEMS':
      return { ...state, numberOfItems: action.payload.newValue }

    default:
      return state
  }
}

const useCarousel = ({
  numberOfItems,
  swipeableConfigOverrides,
}: UseCarouselArgs) => {
  const [carouselState, carouselDispatch] = useReducer(reducer, {
    currentPosition: 0,
    sliding: false,
    slideDirection: 'next',
    numberOfItems,
  })

  const slide = (slideDirection: SlideDirection) => {
    if (slideDirection === 'next') {
      carouselDispatch({
        type: 'NEXT_SLIDE',
      })
    }

    if (slideDirection === 'previous') {
      carouselDispatch({
        type: 'PREVIOUS_SLIDE',
      })
    }

    setTimeout(() => {
      carouselDispatch({ type: 'STOP_SLIDE' })
    }, 50)
  }

  const handlers = useSwipeable({
    onSwipedRight: () => slide('previous'),
    onSwipedLeft: () => slide('next'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    ...swipeableConfigOverrides,
  })

  return { handlers, slide, carouselState, carouselDispatch }
}

export default useCarousel
