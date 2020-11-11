/** @jsx jsx */
import { FC } from 'react'
import { jsx, Box, useSlider, Image, AspectImage } from '@vtex/store-ui'

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
    <Box sx={{ display: 'flex', flexWrap: 'nowrap', flexDirection: 'row' }}>
      <Box>
        {allItems.map((it, index) => (
          <Box
            key={`ProductImageGalleryPage-${index}`}
            sx={{
              width: '80px',
              my: '5px',
              borderStyle: 'solid',
              borderColor: page === index ? '#f17826' : 'gray',
              borderWidth: '1px',
            }}
            onClick={() => setPage(index)}
          >
            <AspectImage
              ratio={1}
              variant={variant}
              {...it.props.targetProps}
            />
          </Box>
        ))}
      </Box>

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
