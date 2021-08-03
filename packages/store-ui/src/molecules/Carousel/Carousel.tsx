import React, { Children, useEffect, useRef } from 'react'
import type { PropsWithChildren } from 'react'

import Button from '../../atoms/Button'
import Icon from '../../atoms/Icon'
import { RightArrowIcon, LeftArrowIcon } from './Arrows'
import Bullets from '../Bullets'
import useSlider from '../../hooks/useSlider'
import type { UseSliderArgs } from '../../hooks/useSlider'

export interface CarouselProps extends UseCarouselArgs {
  testId?: string
}

interface UseCarouselArgs extends Omit<UseSliderArgs, 'totalItems'> {
  variant: 'full' | 'center'
}

function Carousel({
  testId = 'store-carousel',
  children,
  variant = 'center',
  ...rest
}: PropsWithChildren<CarouselProps>) {
  const {
    handlers,
    state: { totalPages, currentPage },
    slide,
  } = useSlider({
    totalItems: Children.count(children),
    itemsPerPage: 1,
    ...rest,
  })

  const currentRef = useRef<HTMLDivElement | null>(null)
  const variants = {
    'data-full': variant === 'full' || undefined,
    'data-center': variant === 'center' || undefined,
  }

  useEffect(() => {
    currentRef.current!.scrollIntoView()
  }, [currentPage])

  return (
    <section
      data-store-carousel
      data-testid={testId}
      aria-label="carousel"
      {...variants}
    >
      <div data-carousel-track-container {...handlers}>
        <div data-carousel-track>
          {Children.map(children, (child, idx) => (
            <div
              data-carousel-item
              key={`carousel-item-${idx}`}
              ref={idx === currentPage ? currentRef : undefined}
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
          data-prev
          onClick={() => slide('previous')}
        >
          <Icon component={<LeftArrowIcon />} />
        </Button>
        <Button
          aria-controls="carousel"
          aria-label="next"
          data-next
          onClick={() => slide('next')}
        >
          <Icon component={<RightArrowIcon />} />
        </Button>
      </div>
      <div data-carousel-bullets>
        <Bullets
          totalQuantity={totalPages}
          activeBullet={currentPage}
          onClick={(_, item) => slide(item)}
        />
      </div>
    </section>
  )
}

export default Carousel
