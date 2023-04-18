import type { ProductSummary_ProductFragment } from '@generated/graphql'
import ProductGridSkeleton from 'src/components/skeletons/ProductGridSkeleton'

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
  const aspectRatio = 1

  return (
    <ProductGridSkeleton
      aspectRatio={aspectRatio}
      loading={products.length === 0}
    >
      <ul data-fs-product-grid>
        {products.map(({ node: product }, idx) => (
          <li key={`${product.id}`}>
            <ProductCard
              product={product}
              index={pageSize * page + idx + 1}
              bordered
              aspectRatio={aspectRatio}
            />
          </li>
        ))}
      </ul>
    </ProductGridSkeleton>
  )
}

export default ProductGrid
