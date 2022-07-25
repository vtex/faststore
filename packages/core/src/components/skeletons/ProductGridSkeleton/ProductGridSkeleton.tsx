import type { PropsWithChildren } from 'react'

import { ITEMS_PER_PAGE } from 'src/constants'
import styles from 'src/components/product/ProductGrid/product-grid.module.scss'

import ProductCardSkeleton from '../ProductCardSkeleton'

interface ProductGridSkeletonProps {
  loading?: boolean
}

function ProductGridSkeleton({
  children,
  loading = true,
}: PropsWithChildren<ProductGridSkeletonProps>) {
  return loading ? (
    <ul className={styles.fsProductGrid}>
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
