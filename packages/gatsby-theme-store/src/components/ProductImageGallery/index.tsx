/** @jsx jsx */
import {
  Box,
  ProductImageGalleryArrowLeft,
  ProductImageGalleryArrowRight,
  ProductImageGalleryMiniaturesContainer,
  ProductImageGalleryPage,
  ProductImageGalleryPaginationDots,
  jsx,
  useSlider,
} from '@vtex/store-ui'
import type { ProductImageGalleryItem as Item } from '@vtex/store-ui'
import { lazy } from 'react'
import type { FC } from 'react'

import SuspenseDevice from '../Suspense/Device'

const ProductImageGalleryMiniatures = lazy(() => import('./Miniatures'))

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
