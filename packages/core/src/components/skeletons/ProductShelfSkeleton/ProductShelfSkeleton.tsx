import type { PropsWithChildren } from 'react'

import {
  ProductShelfItem,
  ProductShelfItems,
  ProductShelf as UIProductShelf,
} from '@faststore/ui'

import ProductCardSkeleton from '../ProductCardSkeleton'

interface Props {
  loading?: boolean
  aspectRatio?: number
  itemsPerPage?: number
}

function ProductShelfSkeleton({
  children,
  aspectRatio,
  itemsPerPage,
  loading = true,
}: PropsWithChildren<Props>) {
  return loading ? (
    <UIProductShelf data-fs-product-shelf-skeleton>
      <ProductShelfItems>
        {Array.from({ length: itemsPerPage }, (_, index) => (
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
