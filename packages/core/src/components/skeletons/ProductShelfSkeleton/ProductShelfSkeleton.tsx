import type { PropsWithChildren } from 'react'

import {
  ProductShelfItem,
  ProductShelfItems,
  ProductShelf as UIProductShelf,
} from '@faststore/ui'

import { ITEMS_PER_SECTION } from 'src/constants'

import ProductCardSkeleton from '../ProductCardSkeleton'

interface Props {
  loading?: boolean
  aspectRatio?: number
}

function ProductShelfSkeleton({
  children,
  aspectRatio,
  loading = true,
}: PropsWithChildren<Props>) {
  return loading ? (
    <UIProductShelf data-fs-product-shelf-skeleton>
      <ProductShelfItems>
        {Array.from({ length: ITEMS_PER_SECTION }, (_, index) => (
          <ProductShelfItem key={String(index)}>
            <ProductCardSkeleton aspectRatio={aspectRatio} sectioned bordered />
          </ProductShelfItem>
        ))}
      </ProductShelfItems>
    </UIProductShelf>
  ) : (
    <>{children}</>
  )
}

export default ProductShelfSkeleton
