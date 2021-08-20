import type { PropsWithChildren } from 'react'
import React, { useMemo } from 'react'
import type { SwipeableProps } from 'react-swipeable'

import Button from '../../atoms/Button'
import Icon from '../../atoms/Icon'
import { RightArrowIcon, LeftArrowIcon } from './Arrows'
import useSlider from '../../hooks/useSlider/useSlider'
import useSlideVisibility from './hooks/useSlideVisibility'
import Bullets from '../Bullets'

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

export interface CarouselProps extends SwipeableProps {
  id: string
  testId?: string
  infiniteMode?: boolean
  controls?: 'complete' | 'navigationArrows' | 'paginationBullets'
  transition?: {
    duration: number
    property: string
    delay?: number
    timing?: string
  }
}

function Carousel({
  infiniteMode = true,
  controls = 'complete',
  testId = 'store-carousel',
  transition = {
    duration: 400,
    property: 'transform',
  },
  children,
  id = 'store-carousel',
  ...swipeableConfigOverrides
}: PropsWithChildren<CarouselProps>) {
  const childrenArray = React.Children.toArray(children)
  const childrenCount = childrenArray.length
  const numberOfSlides = infiniteMode ? childrenCount + 2 : childrenCount
  const slidingTransition = `${transition.property} ${transition.duration}ms ${
    transition.timing ?? ''
  } ${transition.delay ?? ''}`

  const showNavigationArrows =
    controls === 'complete' || controls === 'navigationArrows'

  const showPaginationBullets =
    controls === 'complete' || controls === 'paginationBullets'

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
    <section
      id={id}
      data-store-carousel
      data-testid={testId}
      aria-label="carousel"
    >
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
            sliderDispatch({
              type: 'STOP_SLIDE',
            })

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
          aria-live="polite"
        >
          {slides.map((currentSlide, idx) => (
            <div
              key={idx}
              data-carousel-item
              style={{ width: '100%' }}
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
            aria-controls={id}
            aria-label="previous"
            onClick={() => {
              if (sliderState.sliding) {
                return
              }

              slide('previous', sliderDispatch)
            }}
          >
            <Icon component={<LeftArrowIcon />} />
          </Button>
          <Button
            data-right-arrow
            aria-controls={id}
            aria-label="next"
            onClick={() => {
              if (sliderState.sliding) {
                return
              }

              slide('next', sliderDispatch)
            }}
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
              if (sliderState.sliding) {
                return
              }

              slide(idx, sliderDispatch)
            }}
          />
        </div>
      )}
    </section>
  )
}

export default Carousel
