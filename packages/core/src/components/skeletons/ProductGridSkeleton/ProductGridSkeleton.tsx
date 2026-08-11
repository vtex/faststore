import type { PropsWithChildren } from 'react'

import { ITEMS_PER_PAGE } from 'src/constants'

import ProductCardSkeleton from '../ProductCardSkeleton'

interface ProductGridSkeletonProps {
  loading?: boolean
  aspectRatio?: number
  /** How many placeholder cards to render — defaults to the global ITEMS_PER_PAGE. */
  count?: number
}

function ProductGridSkeleton({
  children,
  aspectRatio,
  loading = true,
  count = ITEMS_PER_PAGE,
}: PropsWithChildren<ProductGridSkeletonProps>) {
  return loading ? (
    <ul data-fs-product-grid>
      {Array.from({ length: count }, (_, index) => (
        <li key={String(index)}>
          <ProductCardSkeleton aspectRatio={aspectRatio} bordered />
        </li>
      ))}
    </ul>
  ) : (
    <>{children}</>
  )
}

export default ProductGridSkeleton
