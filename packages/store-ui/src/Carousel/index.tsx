import React from 'react'
import type { FC } from 'react'

import { Box, useSlider } from '../index'
import CarouselArrowLeft from './ArrowLeft'
import CarouselArrowRight from './ArrowRight'
import CarouselPaginationDots from './PaginationDots'
import { CarouselPage } from './Page'
import type { Item } from './Page'

interface Props {
  allItems: Item[]
  width: string
  height: string
  loading?: 'lazy' | 'eager'
  showArrows?: boolean
  showDots?: boolean
  autoplay?: number
  variant?: string
}

const Carousel: FC<Props> = ({
  allItems,
  loading = 'eager',
  showArrows = true,
  showDots = true,
  width,
  height,
  autoplay,
  variant = 'carousel',
}) => {
  const {
    page,
    items,
    totalPages,
    setPage,
    setNextPage,
    setPreviousPage,
    dragHandlers,
  } = useSlider({
    allItems,
    pageSize: 1,
    autoplay,
  })

  // this is safe, since there is only one item per page
  const [item] = items

  return (
    <Box variant={variant}>
      <Box variant={`${variant}.group`} {...dragHandlers}>
        {showArrows ? (
          <CarouselArrowLeft
            variant={variant}
            onClick={() => setPreviousPage()}
          />
        ) : null}
        <CarouselPage
          variant={variant}
          item={item}
          width={width}
          height={height}
          loading={loading}
        />
        {showArrows ? (
          <CarouselArrowRight variant={variant} onClick={() => setNextPage()} />
        ) : null}
      </Box>
      {showDots ? (
        <CarouselPaginationDots
          variant={variant}
          onSelect={setPage}
          selectedPage={page}
          totalPages={totalPages}
        />
      ) : null}
    </Box>
  )
}

export {
  Carousel,
  CarouselArrowLeft,
  CarouselArrowRight,
  CarouselPaginationDots,
  CarouselPage,
}
