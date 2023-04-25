import type { PropsWithChildren } from 'react'
import { Carousel as UICarousel } from '@faststore/ui'
import type { CarouselProps as UICarouselProps } from '@faststore/ui'

export type CarouselProps = {
  id?: string
  testId?: string
  itemsPerPage?: number
} & Pick<UICarouselProps, 'id' | 'testId' | 'itemsPerPage'>

function Carousel({
  id,
  testId,
  children,
  itemsPerPage = 5,
}: PropsWithChildren<CarouselProps>) {
  const isMobile = window.innerWidth <= 768

  return (
    <UICarousel
      id={id}
      testId={testId}
      variant="scroll"
      infiniteMode={false}
      itemsPerPage={isMobile ? 1 : itemsPerPage}
    >
      {children}
    </UICarousel>
  )
}

export default Carousel
