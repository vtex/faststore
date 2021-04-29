import React from 'react'
import { Box } from 'theme-ui'
import type { ComponentType, FC, AnchorHTMLAttributes } from 'react'

import { useSlider } from '../Slider/hooks/useSlider'
import CarouselArrowLeft from './ArrowLeft'
import CarouselArrowRight from './ArrowRight'
import CarouselPage from './Page'
import CarouselPaginationDots from './PaginationDots'
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
  Link?: ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>>
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
  Link = 'a',
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
          Link={Link}
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

export default Carousel
