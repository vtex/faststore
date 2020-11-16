import React, { FC } from 'react'
import { Flex, useResponsiveSlider } from '@vtex/store-ui'

import { ProductSummary_ProductFragment } from '../ProductSummary/__generated__/ProductSummary_product.graphql'
import ShelfArrowLeft from './ArrowLeft'
import ShelfArrowRight from './ArrowRight'
import ShelfPage from './Page'
import ShelfPaginationDots from './PaginationDots'
import ShelfTitle from './Title'

export interface Props {
  products: Array<ProductSummary_ProductFragment | undefined | null>
  pageSizes?: number[]
  title?: JSX.Element | string
  variant?: string
  showArrows?: boolean
  showDots?: boolean
  autoplay?: boolean
  autoplayTimeout?: number
}

const PAGE_SIZES = [1, 3, 5]

const Shelf: FC<Props> = ({
  products,
  title,
  variant = 'default',
  showArrows,
  showDots,
  autoplay,
  pageSizes = PAGE_SIZES,
  autoplayTimeout,
}) => {
  const {
    page,
    items,
    totalPages,
    setPage,
    setNextPage,
    setPreviousPage,
    dragHandlers,
  } = useResponsiveSlider({
    pageSizes,
    defaultIndex: pageSizes.length - 1,
    allItems: products,
    autoplayTimeout,
    autoplay,
  })

  showArrows = showArrows && products.length >= Math.max(...pageSizes)

  return (
    <>
      {title && <ShelfTitle variant={variant}>{title}</ShelfTitle>}
      <Flex {...dragHandlers}>
        {showArrows && (
          <ShelfArrowLeft variant={variant} onClick={() => setPreviousPage()} />
        )}
        <ShelfPage variant={variant} items={items} pageSizes={pageSizes} />
        {showArrows && (
          <ShelfArrowRight variant={variant} onClick={() => setNextPage()} />
        )}
      </Flex>
      {showDots && (
        <ShelfPaginationDots
          variant={variant}
          onSelect={setPage}
          selectedPage={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}

export default Shelf
