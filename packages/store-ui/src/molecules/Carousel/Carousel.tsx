import type { PropsWithChildren } from 'react'
import type { SwipeableProps } from 'react-swipeable'
import React from 'react'

import Button from '../../atoms/Button'
import Icon from '../../atoms/Icon'
import { RightArrowIcon, LeftArrowIcon } from './Arrows'
import useCarousel from './hooks/useCarousel'
import useSlideVisibility from './hooks/useSlideVisibility'
import Bullets from '../Bullets'

export interface CarouselProps {
  testId?: string
  itemsPerPage?: number
  swipeableConfigOverrides?: SwipeableProps
}

function Carousel({
  testId = 'store-carousel',
  itemsPerPage = 1,
  swipeableConfigOverrides,
  children,
}: PropsWithChildren<CarouselProps>) {
  const numberOfSlides = React.Children.count(children)

  const { handlers, slide, carouselState, carouselDispatch } = useCarousel({
    totalItems: numberOfSlides,
    itemsPerPage,
    swipeableConfigOverrides,
  })

  const { shouldRenderItem, isItemVisible } = useSlideVisibility({
    itemsPerPage: carouselState.itemsPerPage,
    currentSlide: carouselState.currentSlide,
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
              key={idx}
              data-carousel-item
              data-visible={isItemVisible(idx) || undefined}
            >
              {shouldRenderItem(idx) ? child : null}
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
          totalQuantity={carouselState.totalPages}
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
