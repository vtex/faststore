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
  autoplay?: boolean
  autoplayTimeout?: number
}

const Carousel: FC<Props> = ({
  allItems,
  loading = 'eager',
  showArrows = true,
  showDots = true,
  autoplay,
  autoplayTimeout,
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
    autoplayTimeout,
  })

  // this is safe, since there is only one item per page
  const [item] = items

  return (
    <Box sx={{ position: 'relative' }}>
      {showArrows ? (
        <CarouselArrowLeft onClick={() => setPreviousPage()} />
      ) : null}
      <CarouselPage item={item} loading={loading} />
      {showArrows ? <CarouselArrowRight onClick={() => setNextPage()} /> : null}
      {showDots ? (
        <CarouselPaginationDots
          variant="carousel"
          onSelect={setPage}
          selectedPage={page}
          totalPages={totalPages}
        />
      ) : null}
    </Box>
  )
}

export default Carousel
