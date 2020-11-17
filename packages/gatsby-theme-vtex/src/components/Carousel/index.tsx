/** @jsx jsx */
import { FC } from 'react'
import { Box, jsx, useSlider } from '@vtex/store-ui'

import CarouselArrowLeft from './ArrowLeft'
import CarouselArrowRight from './ArrowRight'
import CarouselPaginationDots from './PaginationDots'
import CarouselPage, { Item } from './Page'

interface Props {
  allItems: Item[]
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
  } = useSlider({
    allItems,
    pageSize: 1,
    autoplay,
  })

  // this is safe, since there is only one item per page
  const [item] = items

  return (
    <Box variant={variant}>
      <Box variant={`${variant}.group`}>
        {showArrows ? (
          <CarouselArrowLeft
            variant={variant}
            onClick={() => setPreviousPage()}
          />
        ) : null}
        <CarouselPage variant={variant} item={item} loading={loading} />
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
