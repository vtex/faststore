/** @jsx jsx */
import { FC, Fragment } from 'react'
import { Flex, useResponsiveSlider, jsx } from '@vtex/store-ui'

import { ProductSummary_ProductFragment } from '../ProductSummary/__generated__/ProductSummary_product.graphql'
import ShelfPaginationDots from './PaginationDots'
import ShelfArrowRight from './ArrowRight'
import ShelfArrowLeft from './ArrowLeft'
import ShelfTitle from './Title'
import ShelfPage from './Page'

export interface Props {
  products: Array<ProductSummary_ProductFragment | undefined | null>
  pageSizes?: number[]
  title?: string
  showArrows?: boolean
  showDots?: boolean
  autoplay?: boolean
  autoplayTimeout?: number
}

const PAGE_SIZES = [1, 3, 5]

const Shelf: FC<Props> = ({
  products,
  title,
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
  } = useResponsiveSlider({
    pageSizes,
    defaultIndex: pageSizes.length - 1,
    allItems: products,
    autoplayTimeout,
    autoplay,
  })

  return (
    <Fragment>
      {title ? <ShelfTitle title={title} /> : null}
      <Flex>
        {showArrows ? (
          <ShelfArrowLeft onClick={() => setPreviousPage()} />
        ) : null}
        <ShelfPage items={items} pageSizes={pageSizes} />
        {showArrows ? <ShelfArrowRight onClick={() => setNextPage()} /> : null}
      </Flex>
      {showDots ? (
        <ShelfPaginationDots
          variant="shelf"
          onSelect={setPage}
          selectedPage={page}
          totalPages={totalPages}
        />
      ) : null}
    </Fragment>
  )
}

export default Shelf
