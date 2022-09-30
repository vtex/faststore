import type {
  UIEvent,
  ReactNode,
  CSSProperties,
  KeyboardEvent,
  PropsWithChildren,
} from 'react'
import React, { useMemo, useRef } from 'react'
import type { SwipeableProps } from 'react-swipeable'

import { RightArrowIcon, LeftArrowIcon } from './Arrows'
import CarouselItem from './CarouselItem'
import useSlider from '../../hooks/useSlider/useSlider'
import Bullets from '../Bullets'
import IconButton from '../IconButton'

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
  id?: string
  testId?: string
  infiniteMode?: boolean
  controls?: 'complete' | 'navigationArrows' | 'paginationBullets'
  transition?: {
    duration: number
    property: string
    delay?: number
    timing?: string
  }
  variant?: 'slide' | 'scroll'
  itemsPerPage?: number
  navigationIcons?: {
    left?: ReactNode
    right?: ReactNode
  }
  className?: string
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
  className,
  id = 'store-carousel',
  variant = 'slide',
  itemsPerPage = 1,
  navigationIcons = undefined,
  ...swipeableConfigOverrides
}: PropsWithChildren<CarouselProps>) {
  const trackRef = useRef<HTMLDivElement>(null)
  const isSlideCarousel = variant === 'slide'
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
    itemsPerPage,
    infiniteMode,
    totalItems: childrenCount,
    shouldSlideOnSwipe: isSlideCarousel,
    ...swipeableConfigOverrides,
  })

  const postRenderedSlides =
    infiniteMode && children ? childrenArray.slice(0, 1) : []

  const preRenderedSlides =
    infiniteMode && children ? childrenArray.slice(childrenCount - 1) : []

  const slides = preRenderedSlides.concat(
    (children as any) ?? [],
    postRenderedSlides
  )

  const trackStyle: CSSProperties = useMemo(
    () =>
      isSlideCarousel
        ? {
            display: 'flex',
            width: `${numberOfSlides * 100}%`,
            transition: sliderState.sliding ? slidingTransition : undefined,
            transform: `translate3d(${
              transformValues[sliderState.currentPage]
            }%, 0, 0)`,
          }
        : {
            width: '100%',
            display: 'block',
            overflowX: 'scroll',
            whiteSpace: 'nowrap',
          },
    [
      numberOfSlides,
      isSlideCarousel,
      transformValues,
      slidingTransition,
      sliderState.sliding,
      sliderState.currentPage,
    ]
  )

  const slidePrevious = () => {
    if (
      sliderState.sliding ||
      (!infiniteMode && sliderState.currentPage === 0)
    ) {
      return
    }

    slide('previous', sliderDispatch)
  }

  const slideNext = () => {
    if (
      sliderState.sliding ||
      (!infiniteMode && sliderState.currentPage === childrenCount - 1)
    ) {
      return
    }

    slide('next', sliderDispatch)
  }

  // accessible behavior for tablist
  const handleBulletsKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft': {
        slidePrevious()
        break
      }

      case 'ArrowRight': {
        slideNext()
        break
      }

      case 'Home': {
        slide(0, sliderDispatch)
        break
      }

      case 'End': {
        slide(childrenCount - 1, sliderDispatch)
        break
      }

      default:
    }
  }

  const onScroll = (e: UIEvent) => {
    if (isSlideCarousel) {
      return
    }

    const itemWidth = Number(e.currentTarget.firstElementChild?.scrollWidth)
    const scrollOffset = e.currentTarget?.scrollLeft
    const formatter = scrollOffset > itemWidth / 2 ? Math.round : Math.floor
    const page = formatter(scrollOffset / itemWidth)

    slide(page, sliderDispatch)
  }

  const onTransition = () => {
    sliderDispatch({
      type: 'STOP_SLIDE',
    })

    if (infiniteMode && sliderState.currentItem >= childrenCount) {
      sliderDispatch({
        type: 'GO_TO_PAGE',
        payload: {
          pageIndex: 0,
          shouldSlide: false,
        },
      })
    }

    if (infiniteMode && sliderState.currentItem < 0) {
      sliderDispatch({
        type: 'GO_TO_PAGE',
        payload: {
          pageIndex: sliderState.totalPages - 1,
          shouldSlide: false,
        },
      })
    }
  }

  return (
    <section
      id={id}
      className={className}
      data-store-carousel
      data-testid={testId}
      aria-label="carousel"
      aria-roledescription="carousel"
    >
      <div
        data-carousel-track-container
        style={{
          width: '100%',
          overflow: 'hidden',
          display: isSlideCarousel ? undefined : 'block',
        }}
        {...handlers}
      >
        <div
          ref={trackRef}
          style={trackStyle}
          aria-live="polite"
          data-carousel-track
          onScroll={onScroll}
          onTransitionEnd={onTransition}
        >
          {slides.map((currentSlide, idx) => (
            <CarouselItem
              index={idx}
              key={String(idx)}
              state={sliderState}
              item={currentSlide}
              totalItems={childrenCount}
              infiniteMode={infiniteMode}
              isSlideCarousel={isSlideCarousel}
            />
          ))}
        </div>
      </div>

      <div data-carousel-navigation>
        {showNavigationArrows && (
          <div data-carousel-controls>
            <IconButton
              aria-label="previous"
              data-arrow="left"
              aria-controls={id}
              onClick={slidePrevious}
              icon={navigationIcons?.left ?? <LeftArrowIcon />}
            />
            <IconButton
              aria-label="next"
              data-arrow="right"
              aria-controls={id}
              onClick={slideNext}
              icon={navigationIcons?.right ?? <RightArrowIcon />}
            />
          </div>
        )}

        {showPaginationBullets && (
          <div data-carousel-bullets>
            <Bullets
              tabIndex={0}
              totalQuantity={Math.ceil(
                childrenCount / sliderState.itemsPerPage
              )}
              activeBullet={sliderState.currentPage}
              onClick={(_, idx) => {
                // Scroll Carousel
                if (!isSlideCarousel) {
                  const carouselItemsWidth = Number(
                    trackRef.current?.firstElementChild?.clientWidth
                  )
                  const scrollOffset =
                    idx * carouselItemsWidth - carouselItemsWidth * 0.125

                  // Scroll and center the current item
                  return trackRef.current?.scroll({ left: scrollOffset })
                }

                // Slide Carousel
                if (sliderState.sliding) {
                  return
                }

                slide(idx, sliderDispatch)
              }}
              ariaControlsGenerator={(idx) => `carousel-item-${idx}`}
              onKeyDown={handleBulletsKeyDown}
              onFocus={(event) => {
                event.currentTarget.focus()
              }}
            />
          </div>
        )}
      </div>
    </section>
  )
}

export default Carousel
