import type { CSSProperties, HTMLAttributes, PropsWithChildren } from 'react'
import React from 'react'
import { SliderState, useSlideVisibility } from '../../hooks'

export interface CarouselItemProps extends HTMLAttributes<HTMLLIElement> {
  index: number
  totalItems: number
  state: SliderState
  infiniteMode: boolean
  isScrollCarousel: boolean
  marginRightValue: string
}

function CarouselItem({
  id,
  index,
  state,
  children,
  totalItems,
  infiniteMode,
  isScrollCarousel,
  marginRightValue,
}: PropsWithChildren<CarouselItemProps>) {
  const { isItemVisible, shouldRenderItem } = useSlideVisibility({
    totalItems,
    currentSlide: state.currentItem,
    itemsPerPage: state.itemsPerPage,
  })

  const defaultStyle = { width: '100%' } as CSSProperties
  const scrollCarouselStyle = {
    width: `calc((100% - ${marginRightValue} * ${state.itemsPerPage - 1}) / ${
      state.itemsPerPage
    })`,
  } as CSSProperties

  const style = isScrollCarousel && state.itemsPerPage > 1
    ? { ...scrollCarouselStyle }
    : { ...defaultStyle }

  const shouldDisplayItem =
    isScrollCarousel || shouldRenderItem(index - Number(infiniteMode))

  return (
    <li
      style={style}
      id={`${id}-carousel-item-${index}`}
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
