/** @jsx jsx */
import { FC, lazy } from 'react'
import { jsx, Box, useSlider } from '@vtex/store-ui'

import ProductImageGalleryArrowLeft from './ArrowLeft'
import ProductImageGalleryArrowRight from './ArrowRight'
import ProductImageGalleryPaginationDots from './PaginationDots'
import ProductImageGalleryPage, { Item } from './Page'
import SuspenseDevice from '../Suspense/Device'
import ProductImageGalleryMiniaturesContainer from './Miniatures/Container'

const ProductImageGalleryMiniatures = lazy(() => import('./Miniatures/index'))

interface Props {
  allItems: Item[]
  loading?: 'lazy' | 'eager'
  showArrows?: boolean
  showDots?: boolean
  autoplay?: number
}

const variant = 'productImageGallery'

const ProductImageGallery: FC<Props> = ({
  allItems,
  showArrows = true,
  showDots = true,
  autoplay,
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
  const featuredVariant = `${variant}.featured`

  return (
    <Box variant={variant}>
      <ProductImageGalleryMiniaturesContainer variant={variant}>
        <SuspenseDevice device="desktop" fallback={null}>
          <ProductImageGalleryMiniatures
            variant={variant}
            onSelect={setPage}
            selectedPage={page}
            allItems={allItems}
          />
        </SuspenseDevice>
      </ProductImageGalleryMiniaturesContainer>

      <Box variant={featuredVariant} {...dragHandlers}>
        {showArrows && (
          <ProductImageGalleryArrowLeft
            variant={featuredVariant}
            onClick={() => setPreviousPage()}
          />
        )}

        <ProductImageGalleryPage variant={featuredVariant} item={item} />

        {showArrows && (
          <ProductImageGalleryArrowRight
            variant={featuredVariant}
            onClick={() => setNextPage()}
          />
        )}

        {showDots && (
          <ProductImageGalleryPaginationDots
            variant={featuredVariant}
            onSelect={setPage}
            selectedPage={page}
            totalPages={totalPages}
          />
        )}
      </Box>
    </Box>
  )
}

export default ProductImageGallery
