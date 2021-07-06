import type { PropsWithChildren } from 'react'
import type { SwipeableProps } from 'react-swipeable'
import React, { useReducer } from 'react'
import { useSwipeable } from 'react-swipeable'

import Button from '../../atoms/Button'
import Icon from '../../atoms/Icon'
import { RightArrowIcon, LeftArrowIcon } from './Arrows'

type SlideDirection = 'next' | 'previous'

interface NextSlideAction {
  type: 'NEXT_SLIDE'
}

interface PreviousSlideAction {
  type: 'PREVIOUS_SLIDE'
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

interface CarouselState {
  currentPosition: number
  sliding: boolean
  slideDirection: SlideDirection
  numberOfItems: number
}

export interface CarouselProps {
  testId?: string
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

    case 'STOP_SLIDE':
      return { ...state, sliding: false }

    case 'UPDATE_NUMBER_OF_ITEMS':
      return { ...state, numberOfItems: action.payload.newValue }

    default:
      return state
  }
}

function Carousel({
  testId = 'store-carousel',
  swipeableConfigOverrides,
  children,
}: PropsWithChildren<CarouselProps>) {
  const [carouselState, dispatch] = useReducer(reducer, {
    currentPosition: 0,
    sliding: false,
    slideDirection: 'next',
    numberOfItems: React.Children.count(children),
  })

  const slide = (slideDirection: SlideDirection) => {
    if (slideDirection === 'next') {
      dispatch({
        type: 'NEXT_SLIDE',
      })
    }

    if (slideDirection === 'previous') {
      dispatch({
        type: 'PREVIOUS_SLIDE',
      })
    }

    setTimeout(() => {
      dispatch({ type: 'STOP_SLIDE' })
    }, 50)
  }

  const handlers = useSwipeable({
    onSwipedRight: () => slide('previous'),
    onSwipedLeft: () => slide('next'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    ...swipeableConfigOverrides,
  })

  return (
    <section
      data-store-carousel
      data-testid={testId}
      aria-label="carousel"
      {...handlers}
    >
      <div data-carousel-track-container>
        <div data-carousel-track>
          {React.Children.map(children, (child, idx) => (
            <div
              data-carousel-item
              data-active={idx === carouselState.currentPosition || undefined}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      <div data-carousel-controls>
        <Button
          aria-controls="carousel"
          aria-label="previous"
          onClick={() => slide('previous')}
        >
          <Icon component={<LeftArrowIcon />} />
        </Button>
        <Button
          aria-controls="carousel"
          aria-label="next"
          onClick={() => slide('next')}
        >
          <Icon component={<RightArrowIcon />} />
        </Button>
      </div>
      {`This is the current slide: ${carouselState.currentPosition}`}
    </section>
  )
}

export default Carousel
