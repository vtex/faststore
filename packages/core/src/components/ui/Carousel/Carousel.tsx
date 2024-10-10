import type { PropsWithChildren } from 'react'
import { Carousel as UICarousel } from '@faststore/ui'
import type { CarouselProps as UICarouselProps } from '@faststore/ui'

import useScreenResize from 'src/sdk/ui/useScreenResize'

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
  variant = 'scroll',
  infiniteMode = false,
}: PropsWithChildren<CarouselProps>) {
  const { loading, isTablet, isMobile } = useScreenResize()

  if (loading) return null

  return (
    <UICarousel
      id={id}
      testId={testId}
      variant={variant}
      infiniteMode={infiniteMode}
      itemsPerPage={isTablet || isMobile ? 1.6 : itemsPerPage}
    >
      {children}
    </UICarousel>
  )
}

export default Carousel
