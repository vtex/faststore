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
  infiniteMode?: boolean
  showNavigationArrows?: boolean
  showPaginationBullets?: boolean
  slidingTransition?: string
}

const createTransformValues = (infinite: boolean, totalItems: number) => {
  const transformMap: Record<number, number> = {}
  const slideWidth = 100 / totalItems

  for (let idx = 0; idx < totalItems; ++idx) {
    const currIdx = infinite ? idx - 1 : idx
    const transformValue = -(slideWidth * idx)

    transformMap[currIdx] = transformValue
  }

  return transformMap
}

function Carousel({
  testId = 'store-carousel',
  showNavigationArrows = true,
  showPaginationBullets = true,
  infiniteMode = true,
  slidingTransition = 'transform 400ms 0ms',
  children,
  ...swipeableConfigOverrides
}: PropsWithChildren<CarouselProps>) {
  const childrenArray = React.Children.toArray(children)
  const childrenCount = childrenArray.length
  const numberOfSlides = infiniteMode ? childrenCount + 2 : childrenCount

  const transformValues = useMemo(
    () => createTransformValues(infiniteMode, numberOfSlides),
    [numberOfSlides, infiniteMode]
  )

  const { handlers, slide, sliderState, sliderDispatch } = useSlider({
    totalItems: childrenCount,
    itemsPerPage: 1,
    infiniteMode,
    ...swipeableConfigOverrides,
  })

  const { isItemVisible, shouldRenderItem } = useSlideVisibility({
    itemsPerPage: sliderState.itemsPerPage,
    currentSlide: sliderState.currentItem,
    totalItems: childrenCount,
  })

  const postRenderedSlides =
    infiniteMode && children ? childrenArray.slice(0, 1) : []

  const preRenderedSlides =
    infiniteMode && children ? childrenArray.slice(childrenCount - 1) : []

  const slides = preRenderedSlides.concat(children ?? [], postRenderedSlides)

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
            transition: sliderState.sliding ? slidingTransition : undefined,
            width: `${numberOfSlides * 100}%`,
            transform: `translate3d(${
              transformValues[sliderState.currentPage]
            }%, 0, 0)`,
          }}
          onTransitionEnd={() => {
            if (sliderState.currentItem >= childrenCount) {
              sliderDispatch({
                type: 'GO_TO_PAGE',
                payload: {
                  pageIndex: 0,
                  shouldSlide: false,
                },
              })
            }

            if (sliderState.currentItem < 0) {
              sliderDispatch({
                type: 'GO_TO_PAGE',
                payload: {
                  pageIndex: sliderState.totalPages - 1,
                  shouldSlide: false,
                },
              })
            }
          }}
        >
          {slides.map((currentSlide, idx) => (
            <div
              key={idx}
              data-carousel-item
              style={{ width: `100%` }}
              data-visible={
                isItemVisible(idx - Number(infiniteMode)) || undefined
              }
            >
              {shouldRenderItem(idx - Number(infiniteMode))
                ? currentSlide
                : null}
            </div>
          ))}
        </div>
      </div>

      {showNavigationArrows && (
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
      )}

      {showPaginationBullets && (
        <div data-carousel-bullets>
          <Bullets
            totalQuantity={childrenCount}
            activeBullet={sliderState.currentPage}
            onClick={(_, idx) => {
              slide(idx, sliderDispatch)
            }}
          />
        </div>
      )}
    </section>
  )
}

export default Carousel
