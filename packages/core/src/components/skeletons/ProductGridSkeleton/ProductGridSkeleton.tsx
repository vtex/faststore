import type { PropsWithChildren } from 'react'

import { ITEMS_PER_PAGE } from 'src/constants'

import ProductCardSkeleton from '../ProductCardSkeleton'

interface Props {
  loading?: boolean
}

function ProductGridSkeleton({
  children,
  loading = true,
}: PropsWithChildren<Props>) {
  return loading ? (
    <ul className="product-grid">
      {Array.from({ length: ITEMS_PER_PAGE }, (_, index) => (
        <li key={String(index)}>
          <ProductCardSkeleton bordered />
        </li>
      ))}
    </ul>
  ) : (
    <>{children}</>
  )
}

export default ProductGridSkeleton
