import type { CSSProperties, HTMLAttributes, PropsWithChildren } from 'react'
import React from 'react'
import { SliderState, useSlideVisibility } from '../../hooks'

export interface CarouselItemProps extends HTMLAttributes<HTMLLIElement> {
  index: number
  totalItems: number
  state: SliderState
  infiniteMode: boolean
  isScrollCarousel: boolean
}

function CarouselItem({
  id,
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
      tabIndex={0}
      style={style}
      id={`${id}-carousel-item-${index}`}
      aria-hidden={isItemVisible(index - Number(infiniteMode)) === false}
      data-fs-carousel-item
      data-fs-carousel-item-visible={
        isItemVisible(index - Number(infiniteMode)) || undefined
      }
    >
      {shouldDisplayItem ? children : null}
    </li>
  )
}

export default CarouselItem
