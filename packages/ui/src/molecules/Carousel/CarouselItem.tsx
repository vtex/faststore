import React from 'react'
import type { CSSProperties, PropsWithChildren } from 'react'
import type { SliderState } from '../../hooks/useSlider/useSlider'

import useSlideVisibility from './hooks/useSlideVisibility'

interface CarouselItemProps {
  index: number
  totalItems: number
  state: SliderState
  infiniteMode: boolean
  isScrollCarousel: boolean
}

function CarouselItem({
  index,
  state,
  children,
  totalItems,
  infiniteMode,
  isScrollCarousel,
}: PropsWithChildren<CarouselItemProps>) {
  const { isItemVisible, shouldRenderItem } = useSlideVisibility({
    totalItems,
    currentSlide: state.currentItem,
    itemsPerPage: state.itemsPerPage,
  })

  const style =
    ((!isScrollCarousel && { width: '100%' }) as CSSProperties) ||
    ((isScrollCarousel && {
      maxWidth: '80%',
      display: 'inline-block',
    }) as CSSProperties)

  const shouldDisplayItem =
    isScrollCarousel || shouldRenderItem(index - Number(infiniteMode))

  return (
    <div
      style={style}
      role="tabpanel"
      data-fs-carousel-item
      aria-roledescription="slide"
      id={`carousel-item-${index}`}
      data-fs-carousel-item-visible={
        isItemVisible(index - Number(infiniteMode)) || undefined
      }
    >
      {shouldDisplayItem ? children : null}
    </div>
  )
}

export default CarouselItem
