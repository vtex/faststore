import type { PropsWithChildren } from 'react'
import React, { useMemo } from 'react'
import type { SwipeableProps } from 'react-swipeable'

import Button from '../../atoms/Button'
import Icon from '../../atoms/Icon'
import { RightArrowIcon, LeftArrowIcon } from './Arrows'
import useSlider from '../../hooks/useSlider/useSlider'
import useSlideVisibility from './hooks/useSlideVisibility'
import Bullets from '../Bullets'

export interface CarouselProps extends SwipeableProps {
  testId?: string
}

const createTransformValues = (totalItems: number) => {
  const slideWidth = 100 / totalItems

  const transformArray = Array(totalItems)
    .fill(0)
    .map((_, idx) => -(slideWidth * idx))

  return transformArray
}

function Carousel({
  testId = 'store-carousel',
  children,
  ...swipeableConfigOverrides
}: PropsWithChildren<CarouselProps>) {
  const numberOfSlides = React.Children.count(children)

  const transformValues = useMemo(() => createTransformValues(numberOfSlides), [
    numberOfSlides,
  ])

  const { handlers, slide, sliderState, sliderDispatch } = useSlider({
    totalItems: numberOfSlides,
    itemsPerPage: 1,
    ...swipeableConfigOverrides,
  })

  const { isItemVisible, shouldRenderItem } = useSlideVisibility({
    itemsPerPage: sliderState.itemsPerPage,
    currentSlide: sliderState.currentSlide,
  })

  return (
    <section data-store-carousel data-testid={testId} aria-label="carousel">
      <div
        data-carousel-track-container
        style={{ overflow: 'hidden', width: '100%' }}
        {...handlers}
      >
        <div
          data-carousel-track
          style={{
            display: 'flex',
            width: `${(numberOfSlides * 100) / sliderState.itemsPerPage}%`,
            transform: `translate3d(${
              transformValues[sliderState.currentPage]
            }%, 0, 0)`,
          }}
        >
          {React.Children.map(children, (child, idx) => (
            <div
              key={idx}
              data-carousel-item
              style={{ width: `100%` }}
              data-visible={isItemVisible(idx) || undefined}
            >
              {shouldRenderItem(idx) ? child : null}
            </div>
          ))}
        </div>
      </div>
      <div data-carousel-controls>
        <Button
          data-left-arrow
          aria-controls="carousel"
          aria-label="previous"
          onClick={() => slide('previous', sliderDispatch)}
        >
          <Icon component={<LeftArrowIcon />} />
        </Button>
        <Button
          data-right-arrow
          aria-controls="carousel"
          aria-label="next"
          onClick={() => slide('next', sliderDispatch)}
        >
          <Icon component={<RightArrowIcon />} />
        </Button>
      </div>
      <div data-carousel-bullets>
        <Bullets
          totalQuantity={sliderState.totalPages}
          activeBullet={sliderState.currentPage}
          onClick={(_, idx) => {
            sliderDispatch({
              type: 'GO_TO_PAGE',
              payload: {
                pageIndex: idx,
              },
            })
          }}
        />
      </div>
    </section>
  )
}

export default Carousel
