import {
  ProductGrid as UIProductGrid,
  ProductGridItem as UIProductGridItem,
} from '@faststore/ui'
import type { ProductSummary_ProductFragment } from '@generated/graphql'
import ProductGridSkeleton from 'src/components/skeletons/ProductGridSkeleton'

import ProductCard, { ProductCardProps } from '../ProductCard'

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
  /**
   * CMS defined data to be used in ProductCard component.
   */
  productCard?: Pick<ProductCardProps, 'showDiscountBadge' | 'bordered'>
}

function ProductGrid({ products, page, pageSize, productCard }: Props) {
  const aspectRatio = 1

  return (
    <ProductGridSkeleton
      aspectRatio={aspectRatio}
      loading={products.length === 0}
    >
      <UIProductGrid>
        {products.map(({ node: product }, idx) => (
          <UIProductGridItem key={`${product.id}`}>
            <ProductCard
              product={product}
              index={pageSize * page + idx + 1}
              bordered={productCard?.bordered}
              showDiscountBadge={productCard?.showDiscountBadge}
              aspectRatio={aspectRatio}
              imgProps={{
                width: 150,
                height: 150,
                sizes: '30vw',
              }}
            />
          </UIProductGridItem>
        ))}
      </UIProductGrid>
    </ProductGridSkeleton>
  )
}

export default ProductGrid
