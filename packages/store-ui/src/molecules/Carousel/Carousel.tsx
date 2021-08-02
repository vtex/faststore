import React, { Children, createRef, useMemo } from 'react'
import type { PropsWithChildren } from 'react'

import Button from '../../atoms/Button'
import Icon from '../../atoms/Icon'
import { RightArrowIcon, LeftArrowIcon } from './Arrows'
import Bullets from '../Bullets'
import useSlider, { nextPage, previousPage } from '../../hooks/useSlider'
import type { UseSliderArgs } from '../../hooks/useSlider'

export interface CarouselProps extends UseCarouselArgs {
  testId?: string
}

interface UseCarouselArgs extends Omit<UseSliderArgs, 'totalItems'> {
  variant: 'full' | 'preview'
}

function Carousel({
  testId = 'store-carousel',
  children,
  variant = 'preview',
  ...rest
}: PropsWithChildren<CarouselProps>) {
  const totalItems = Children.count(children)
  const refs = useMemo(
    () =>
      Array(totalItems)
        .fill(0)
        .map((_) => createRef<HTMLDivElement>()),
    [totalItems]
  )

  const {
    handlers,
    state: { totalPages, currentPage },
    slide,
  } = useSlider({
    totalItems,
    itemsPerPage: 1,
    ...rest,
  })

  const variants = {
    'data-full': variant === 'full' || undefined,
    'data-preview': variant === 'preview' || undefined,
  }

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
              ref={refs[idx]}
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
          onClick={() => {
            const item = previousPage(currentPage, totalPages)

            refs[item].current?.scrollIntoView()

            slide('previous')
          }}
        >
          <Icon component={<LeftArrowIcon />} />
        </Button>
        <Button
          aria-controls="carousel"
          aria-label="next"
          data-next
          onClick={() => {
            const item = nextPage(currentPage, totalPages)

            refs[item].current?.scrollIntoView()

            slide('next')
          }}
        >
          <Icon component={<RightArrowIcon />} />
        </Button>
      </div>
      <div data-carousel-bullets>
        <Bullets
          totalQuantity={totalPages}
          activeBullet={currentPage}
          onClick={({ target }, item) => {
            // eslint-disable-next-line @typescript-eslint/no-extra-semi
            ;(target as any)?.blur()

            refs[item].current?.scrollIntoView()

            slide(item)
          }}
        />
      </div>
    </section>
  )
}

export default Carousel
