/** @jsx jsx */
import { FC } from 'react'
import { Box, Flex, jsx, useSlider } from '@vtex/store-ui'

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

const variant = 'productImageGallery'

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
    <Box variant={variant}>
      <Box variant={`${variant}.group`}>
        {showArrows ? (
          <ProductImageGalleryArrowLeft
            variant={variant}
            onClick={() => setPreviousPage()}
          />
        ) : null}
        <ProductImageGalleryPage item={item} />
        {showArrows ? (
          <ProductImageGalleryArrowRight
            variant={variant}
            onClick={() => setNextPage()}
          />
        ) : null}
      </Box>
      {showDots ? (
        <ProductImageGalleryPaginationDots
          variant={variant}
          onSelect={setPage}
          selectedPage={page}
          totalPages={totalPages}
        />
      ) : null}
    </Box>
  )
}

export default ProductImageGallery
