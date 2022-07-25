import type { PropsWithChildren } from 'react'

import { ITEMS_PER_SECTION } from 'src/constants'
import styles from 'src/components/sections/ProductShelf/product-shelf.module.scss'

import ProductCardSkeleton from '../ProductCardSkeleton'

interface Props {
  loading?: boolean
}

function ProductShelfSkeleton({
  children,
  loading = true,
}: PropsWithChildren<Props>) {
  return loading ? (
    <ul
      data-fs-product-shelf-items
      className={`layout__content ${styles.fsProductShelf}`}
    >
      {Array.from({ length: ITEMS_PER_SECTION }, (_, index) => (
        <li key={String(index)}>
          <ProductCardSkeleton sectioned />
        </li>
      ))}
    </ul>
  ) : (
    <>{children}</>
  )
}

export default ProductShelfSkeleton
