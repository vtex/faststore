/**
 * This is a simple version of its business logic. The intent it to have
 * an example of the hooks and components so store implementors can tweek
 * and implement their own based on their own needs. However, this should
 * cover 80% use cases.
 */

import React from 'react'
import { Flex } from 'theme-ui'
import type { PropsWithChildren } from 'react'

import { useResponsiveSlider } from '../Slider/hooks/useResponsiveSlider'
import ShelfArrowLeft from './ArrowLeft'
import ShelfArrowRight from './ArrowRight'
import ShelfPage from './Page'
import ShelfPaginationDots from './PaginationDots'
import ShelfTitle from './Title'
import type { ProductSummary, Product } from './Page'

interface Props<T extends Product> {
  products: T[]
  title?: JSX.Element | string
  autoplay?: number
  showArrows?: boolean
  showDots?: boolean
  pageSizes?: number[]
  variant?: string
  ProductSummary: ProductSummary<T>
}

const PAGE_SIZES = [1, 3, 5]
const DEFAULT_VARIANT = 'default'

const Shelf = <T extends Product>({
  products,
  title,
  showArrows,
  showDots,
  autoplay,
  variant = DEFAULT_VARIANT,
  pageSizes = PAGE_SIZES,
  ProductSummary: Component,
}: PropsWithChildren<Props<T>>) => {
  const {
    page,
    items,
    totalPages,
    setPage,
    setNextPage,
    setPreviousPage,
    dragHandlers,
  } = useResponsiveSlider<T>({
    pageSizes,
    defaultIndex: pageSizes.length - 1,
    allItems: products,
    autoplay,
  })

  const withArrows = showArrows === true && products.length >= items.length

  return (
    <>
      {title !== undefined && (
        <ShelfTitle variant={variant}>{title}</ShelfTitle>
      )}
      <Flex {...dragHandlers}>
        {withArrows === true && (
          <ShelfArrowLeft variant={variant} onClick={() => setPreviousPage()} />
        )}
        <ShelfPage
          ProductSummary={Component}
          variant={variant}
          items={items}
          pageSizes={pageSizes}
        />
        {withArrows === true && (
          <ShelfArrowRight variant={variant} onClick={() => setNextPage()} />
        )}
      </Flex>
      {showDots === true && (
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
