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
  const carouselTrackRef = useRef<HTMLDivElement>(null)
  const isSlideCarousel = variant === 'slide'
  const isScrollCarousel = variant === 'scroll'
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

  const slideCarouselTrackStyle: CSSProperties = useMemo(
    () => ({
      display: 'flex',
      width: `${numberOfSlides * 100}%`,
      transition: sliderState.sliding ? slidingTransition : undefined,
      transform: `translate3d(${
        transformValues[sliderState.currentPage]
      }%, 0, 0)`,
    }),
    [
      numberOfSlides,
      transformValues,
      slidingTransition,
      sliderState.sliding,
      sliderState.currentPage,
    ]
  )

  const scrollCarouselTrackStyle: CSSProperties = useMemo(
    () => ({
      width: '100%',
      display: 'block',
      overflowX: 'scroll',
      whiteSpace: 'nowrap',
    }),
    []
  )

  const carouselTrackStyle =
    ((isSlideCarousel && slideCarouselTrackStyle) as CSSProperties) ||
    ((isScrollCarousel && scrollCarouselTrackStyle) as CSSProperties)

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

  const onScrollTrack = (event: UIEvent) => {
    if (isSlideCarousel || itemsPerPage > 1) {
      return
    }

    const itemWidth = Number(event.currentTarget.firstElementChild?.scrollWidth)
    const scrollOffset = event.currentTarget?.scrollLeft
    const formatter = scrollOffset > itemWidth / 2 ? Math.round : Math.floor
    const page = formatter(scrollOffset / itemWidth)

    slide(page, sliderDispatch)
  }

  const onTransitionTrackEnd = () => {
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

  const onScrollPagination = async (
    index: number,
    slideDirection?: 'previous' | 'next'
  ) => {
    if (slideDirection === 'previous' && sliderState.currentPage === 0) {
      return
    }

    if (
      slideDirection === 'next' &&
      sliderState.currentPage === sliderState.totalPages - 1
    ) {
      return
    }

    let scrollOffset
    const carouselItemsWidth = Number(
      carouselTrackRef.current?.firstElementChild?.clientWidth
    )

    if (itemsPerPage > 1) {
      scrollOffset = index * carouselItemsWidth * itemsPerPage
    } else {
      scrollOffset = index * carouselItemsWidth - carouselItemsWidth * 0.125
    }

    carouselTrackRef.current?.scrollTo({
      left: scrollOffset,
      behavior: 'smooth',
    })

    slide(index, sliderDispatch)
  }

  // accessible behavior for tablist
  const handleBulletsKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft': {
        isSlideCarousel && slidePrevious()
        isScrollCarousel &&
          onScrollPagination(sliderState.currentPage - 1, 'previous')
        break
      }

      case 'ArrowRight': {
        isSlideCarousel && slideNext()
        isScrollCarousel &&
          onScrollPagination(sliderState.currentPage + 1, 'next')
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

  return (
    <section
      id={id}
      data-fs-carousel
      className={className}
      data-testid={testId}
      aria-label="carousel"
      aria-roledescription="carousel"
    >
      <div
        data-fs-carousel-track-container
        style={{
          width: '100%',
          overflow: 'hidden',
          display: isScrollCarousel ? 'block' : undefined,
        }}
        {...handlers}
      >
        <div
          ref={carouselTrackRef}
          style={carouselTrackStyle}
          aria-live="polite"
          data-fs-carousel-track
          onScroll={onScrollTrack}
          onTransitionEnd={onTransitionTrackEnd}
        >
          {slides.map((currentSlide, idx) => (
            <CarouselItem
              index={idx}
              key={String(idx)}
              state={sliderState}
              totalItems={childrenCount}
              infiniteMode={infiniteMode}
              isScrollCarousel={isScrollCarousel}
            >
              {currentSlide}
            </CarouselItem>
          ))}
        </div>
      </div>

      {showNavigationArrows && (
        <div data-fs-carousel-controls>
          <IconButton
            data-arrow="left"
            aria-controls={id}
            aria-label="previous"
            icon={navigationIcons?.left ?? <LeftArrowIcon />}
            onClick={() => {
              isSlideCarousel && slidePrevious()
              isScrollCarousel &&
                onScrollPagination(sliderState.currentPage - 1, 'previous')
            }}
          />
          <IconButton
            data-arrow="right"
            aria-controls={id}
            aria-label="next"
            icon={navigationIcons?.right ?? <RightArrowIcon />}
            onClick={() => {
              isSlideCarousel && slideNext()
              isScrollCarousel &&
                onScrollPagination(sliderState.currentPage + 1, 'next')
            }}
          />
        </div>
      )}

      {showPaginationBullets && (
        <div data-fs-carousel-bullets>
          <Bullets
            tabIndex={0}
            activeBullet={sliderState.currentPage}
            totalQuantity={Math.ceil(childrenCount / sliderState.itemsPerPage)}
            onKeyDown={handleBulletsKeyDown}
            onClick={async (_, idx) => {
              isSlideCarousel &&
                !sliderState.sliding &&
                slide(idx, sliderDispatch)

              isScrollCarousel && onScrollPagination(idx)
            }}
            onFocus={(event) => event.currentTarget.focus()}
            ariaControlsGenerator={(idx) => `carousel-item-${idx}`}
          />
        </div>
      )}
    </section>
  )
}

export default Carousel
