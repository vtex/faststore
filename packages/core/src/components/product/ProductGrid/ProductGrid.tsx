import ProductGridSkeleton from 'src/components/skeletons/ProductGridSkeleton'
import type { ProductSummary_ProductFragment } from '@generated/graphql'
import styles from 'src/components/product/ProductGrid/product-grid.module.scss'

import ProductCard from '../ProductCard'

interface Props {
  /**
   * Products listed on the grid.
   */
  products: Array<{ node: ProductSummary_ProductFragment }>
  page: number
  /**
   * Quantity of products listed.
   */
  pageSize: number
}

function ProductGrid({ products, page, pageSize }: Props) {
  return (
    <ProductGridSkeleton loading={products.length === 0}>
      <ul data-fs-product-grid className={styles.fsProductGrid}>
        {products.map(({ node: product }, idx) => (
          <li key={`${product.id}`}>
            <ProductCard
              product={product}
              index={pageSize * page + idx + 1}
              bordered
            />
          </li>
        ))}
      </ul>
    </ProductGridSkeleton>
  )
}

export default ProductGrid
