import type { PropsWithChildren } from 'react'
import type { SwipeableProps } from 'react-swipeable'
import React from 'react'

import Button from '../../atoms/Button'
import Icon from '../../atoms/Icon'
import { RightArrowIcon, LeftArrowIcon } from './Arrows'
import type { CarouselState } from './hooks/useCarousel'
import { useCarousel } from './hooks/useCarousel'
import Bullets from '../../molecules/Bullets'

export interface CarouselProps {
  testId?: string
  itemsPerPage?: number
  swipeableConfigOverrides?: SwipeableProps
}

function isSlideVisible(carouselState: CarouselState, slideIdx: number) {
  const { itemsPerPage, currentSlide } = carouselState

  return slideIdx >= currentSlide && slideIdx < currentSlide + itemsPerPage
}

function Carousel({
  testId = 'store-carousel',
  itemsPerPage = 2,
  swipeableConfigOverrides,
  children,
}: PropsWithChildren<CarouselProps>) {
  const numberOfSlides = React.Children.count(children)
  const numberOfPages = Math.ceil(numberOfSlides / itemsPerPage)

  const { handlers, slide, carouselState, carouselDispatch } = useCarousel({
    totalItems: numberOfSlides,
    itemsPerPage,
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
              data-visible={isSlideVisible(carouselState, idx) || undefined}
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
          onClick={() => slide('previous', carouselDispatch)}
        >
          <Icon component={<LeftArrowIcon />} />
        </Button>
        <Button
          aria-controls="carousel"
          aria-label="next"
          onClick={() => slide('next', carouselDispatch)}
        >
          <Icon component={<RightArrowIcon />} />
        </Button>
      </div>
      <div data-carousel-bullets>
        <Bullets
          totalQuantity={numberOfPages}
          activeBullet={carouselState.currentPage}
          onClick={(_, idx) =>
            carouselDispatch({
              type: 'GO_TO_PAGE',
              payload: {
                pageIndex: idx,
              },
            })
          }
        />
      </div>
    </section>
  )
}

export default Carousel
