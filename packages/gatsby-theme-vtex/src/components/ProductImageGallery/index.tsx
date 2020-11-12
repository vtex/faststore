/** @jsx jsx */
import { FC, lazy } from 'react'
import { jsx, Box, useSlider } from '@vtex/store-ui'

import ProductImageGalleryArrowLeft from './ArrowLeft'
import ProductImageGalleryArrowRight from './ArrowRight'
import ProductImageGalleryPaginationDots from './PaginationDots'
import ProductImageGalleryPage, { Item } from './Page'
import SuspenseDevice from '../Suspense/Device'
import Container from './PaginationMiniatures/Container'

const PaginationMiniatures = lazy(() => import('./PaginationMiniatures/index'))

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
    <Box sx={{ display: 'flex', flexWrap: 'nowrap', flexDirection: 'row' }}>
      <SuspenseDevice
        device="desktop"
        fallback={<Container variant={variant} />}
      >
        <PaginationMiniatures
          variant={variant}
          onSelect={setPage}
          selectedPage={page}
          allItems={allItems}
        />
      </SuspenseDevice>

      <Box variant={variant} sx={{ flexGrow: 4 }}>
        <Box variant={`${variant}.group`} sx={{ flexGrow: 2 }}>
          {showArrows && (
            <ProductImageGalleryArrowLeft
              variant={variant}
              onClick={() => setPreviousPage()}
            />
          )}
          <ProductImageGalleryPage variant={variant} item={item} />
          {showArrows && (
            <ProductImageGalleryArrowRight
              variant={variant}
              onClick={() => setNextPage()}
            />
          )}
        </Box>
        {showDots && (
          <ProductImageGalleryPaginationDots
            variant={variant}
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
