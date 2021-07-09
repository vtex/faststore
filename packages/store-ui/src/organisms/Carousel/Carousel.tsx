import type { PropsWithChildren } from 'react'
import type { SwipeableProps } from 'react-swipeable'
import React from 'react'

import Button from '../../atoms/Button'
import Icon from '../../atoms/Icon'
import { RightArrowIcon, LeftArrowIcon } from './Arrows'
import useCarousel from './useCarousel'

export interface CarouselProps {
  testId?: string
  swipeableConfigOverrides?: SwipeableProps
}

function Carousel({
  testId = 'store-carousel',
  swipeableConfigOverrides,
  children,
}: PropsWithChildren<CarouselProps>) {
  const { handlers, slide, carouselState } = useCarousel({
    numberOfItems: React.Children.count(children),
    swipeableConfigOverrides,
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
