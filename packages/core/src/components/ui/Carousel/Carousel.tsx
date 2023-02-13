import type { PropsWithChildren } from 'react'
import { Carousel as UICarousel } from '@faststore/ui'
import type { CarouselProps as UICarouselProps } from '@faststore/ui'

import Icon from 'src/components/ui/Icon'

import styles from './carousel.module.scss'

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
      className={styles.fsCarousel}
      itemsPerPage={isMobile ? 1 : itemsPerPage}
      navigationIcons={{
        left: <Icon width={20} height={20} weight="bold" name="ArrowLeft" />,
        right: <Icon width={20} height={20} weight="bold" name="ArrowRight" />,
      }}
    >
      {children}
    </UICarousel>
  )
}

export default Carousel
