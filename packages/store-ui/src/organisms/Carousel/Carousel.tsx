import type { PropsWithChildren } from 'react'
import type { SwipeableProps } from 'react-swipeable'
import React from 'react'

import Button from '../../atoms/Button'
import Icon from '../../atoms/Icon'
import { RightArrowIcon, LeftArrowIcon } from './Arrows'
import type { SlideDirection } from './hooks/useCarousel'
import { useCarousel } from './hooks/useCarousel'

export interface CarouselProps {
  testId?: string
  swipeableConfigOverrides?: SwipeableProps
}

function Carousel({
  testId = 'store-carousel',
  swipeableConfigOverrides,
  children,
}: PropsWithChildren<CarouselProps>) {
  const { handlers, carouselState, carouselDispatch } = useCarousel({
    totalItems: React.Children.count(children),
    itemsPerPage: 2,
    swipeableConfigOverrides,
  })

  const slide = (slideDirection: SlideDirection) => {
    if (slideDirection === 'next') {
      carouselDispatch({
        type: 'NEXT_PAGE',
      })
    }

    if (slideDirection === 'previous') {
      carouselDispatch({
        type: 'PREVIOUS_PAGE',
      })
    }

    setTimeout(() => {
      carouselDispatch({ type: 'STOP_SLIDE' })
    }, 50)
  }

  return (
    <section
      data-store-carousel
      data-testid={testId}
      aria-label="carousel"
      {...handlers}
    >
      <div data-carousel-track-container>
        <div style={{ display: 'flex' }} data-carousel-track>
          {React.Children.map(children, (child, idx) => (
            <div
              data-carousel-item
              data-active={idx === carouselState.currentSlide || undefined}
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
      {`This is the current slide: ${carouselState.currentSlide}`}
      {`This is the current page: ${carouselState.currentPage}`}
    </section>
  )
}

export default Carousel
