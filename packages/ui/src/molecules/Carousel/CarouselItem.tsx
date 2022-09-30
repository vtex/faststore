import React, { useMemo } from 'react'
import type { ReactNode, CSSProperties } from 'react'
import type { SliderState } from '../../hooks/useSlider/useSlider'

import useSlideVisibility from './hooks/useSlideVisibility'

interface CarouselItemProps {
  index: number
  item: ReactNode
  totalItems: number
  state: SliderState
  infiniteMode: boolean
  isSlideCarousel: boolean
}

function CarouselItem({
  item,
  index,
  state,
  totalItems,
  infiniteMode,
  isSlideCarousel,
}: CarouselItemProps) {
  const { isItemVisible, shouldRenderItem } = useSlideVisibility({
    totalItems,
    currentSlide: state.currentItem,
    itemsPerPage: state.itemsPerPage,
  })

  const style: CSSProperties = useMemo(
    () =>
      isSlideCarousel
        ? { width: '100%' }
        : {
            maxWidth: '80%',
            display: 'inline-block',
            opacity: isItemVisible(index - Number(infiniteMode)) ? 1 : 0.2,
          },
    [index, infiniteMode, isItemVisible, isSlideCarousel]
  )

  const shouldDisplayItem =
    !isSlideCarousel || shouldRenderItem(index - Number(infiniteMode))

  return (
    <div
      style={style}
      role="tabpanel"
      data-carousel-item
      aria-roledescription="slide"
      id={`carousel-item-${index}`}
      data-visible={isItemVisible(index - Number(infiniteMode)) || undefined}
    >
      {shouldDisplayItem ? item : null}
    </div>
  )
}

export default CarouselItem
