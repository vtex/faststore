import type { PropsWithChildren } from 'react'
import { Carousel as UICarousel } from '@faststore/ui'
import type { CarouselProps as UICarouselProps } from '@faststore/ui'

export type CarouselProps = {
  id?: string
  testId?: string
  itemsPerPage?: number
  variant?: 'slide' | 'scroll'
  infiniteMode?: boolean
} & Pick<
  UICarouselProps,
  'id' | 'testId' | 'itemsPerPage' | 'variant' | 'infiniteMode'
>

function Carousel({
  id,
  testId,
  children,
  itemsPerPage,
  variant = 'slide',
  infiniteMode = false,
}: PropsWithChildren<CarouselProps>) {
  const isMobile = window.innerWidth <= 768

  return (
    <UICarousel
      id={id}
      testId={testId}
      variant={variant}
      infiniteMode={infiniteMode}
      itemsPerPage={isMobile ? 1.6 : itemsPerPage}
    >
      {children}
    </UICarousel>
  )
}

export default Carousel
