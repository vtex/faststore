/* eslint-disable @next/next/no-img-element */
import React, { PropsWithChildren } from 'react'
import { Carousel } from '@faststore/ui'
import styles from './carousel-item.module.css'

export type CarouselSimpleProps = {
  itemsPerPage: number
  infiniteMode: boolean
  variant: 'slide' | 'scroll'
}

export const CarouselSimpleUsage = ({
  itemsPerPage = 5,
  infiniteMode = false,
  variant,
}: PropsWithChildren<CarouselSimpleProps>) => {
  const isMobile = window.innerWidth <= 768
  return (
    <Carousel
      itemsPerPage={isMobile ? 1 : itemsPerPage}
      variant={variant}
      infiniteMode={infiniteMode}
    >
      {[...Array(10)].map((_, index) => (
        <div key={index} className={styles.carouselItem}>
          {index + 1}
        </div>
      ))}
    </Carousel>
  )
}

export default CarouselSimpleUsage
