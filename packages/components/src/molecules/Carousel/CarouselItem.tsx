import React from 'react'
import type { CSSProperties, PropsWithChildren, HTMLAttributes } from 'react'
import { useSlideVisibility, SliderState } from '../../hooks'

export interface CarouselItemProps extends HTMLAttributes<HTMLLIElement> {
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
      maxWidth: '60%',
      display: 'inline-block',
    }) as CSSProperties)

  const shouldDisplayItem =
    isScrollCarousel || shouldRenderItem(index - Number(infiniteMode))

  return (
    <li
      style={style}
      data-fs-carousel-item
      aria-roledescription="slide"
      id={`carousel-item-${index}`}
      data-fs-carousel-item-visible={
        isItemVisible(index - Number(infiniteMode)) || undefined
      }
    >
      {shouldDisplayItem ? children : null}
    </li>
  )
}

export default CarouselItem
