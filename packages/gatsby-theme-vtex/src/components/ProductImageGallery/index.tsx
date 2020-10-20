/** @jsx jsx */
import { FC } from 'react'
import { Box, jsx, useSlider } from '@vtex/store-ui'

import ProductImageGalleryArrowLeft from './ArrowLeft'
import ProductImageGalleryArrowRight from './ArrowRight'
import ProductImageGalleryPaginationDots from './PaginationDots'
import ProductImageGalleryPage, { Item } from './Page'

interface Props {
  allItems: Item[]
  loading?: 'lazy' | 'eager'
  showArrows?: boolean
  showDots?: boolean
  autoplay?: boolean
  autoplayTimeout?: number
}

const ProductImageGallery: FC<Props> = ({
  allItems,
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
        <ProductImageGalleryArrowLeft onClick={() => setPreviousPage()} />
      ) : null}
      <ProductImageGalleryPage item={item} />
      {showArrows ? (
        <ProductImageGalleryArrowRight onClick={() => setNextPage()} />
      ) : null}
      {showDots ? (
        <ProductImageGalleryPaginationDots
          variant="productImageGallery"
          onSelect={setPage}
          selectedPage={page}
          totalPages={totalPages}
        />
      ) : null}
    </Box>
  )
}

export default ProductImageGallery
