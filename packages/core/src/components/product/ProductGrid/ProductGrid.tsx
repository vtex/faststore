import {
  ProductGrid as UIProductGrid,
  ProductGridItem as UIProductGridItem,
} from '@faststore/ui'
import type { ClientManyProductsQueryQuery } from '@generated/graphql'
import ProductGridSkeleton from 'src/components/skeletons/ProductGridSkeleton'

import { ProductCardProps } from '../ProductCard'

import { __experimentalProductCard as ProductCard } from 'src/components/sections/ProductGallery/Overrides'
import { memo } from 'react'

interface Props {
  /**
   * Products listed on the grid.
   */
  products: ClientManyProductsQueryQuery['search']['products']['edges']
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

function ProductGrid({
  products,
  page,
  pageSize,
  productCard: {
    showDiscountBadge = ProductCard.props.showDiscountBadge,
    bordered = ProductCard.props.bordered,
  } = {},
}: Props) {
  const aspectRatio = 1

  return (
    <ProductGridSkeleton
      aspectRatio={aspectRatio}
      loading={products.length === 0}
    >
      <UIProductGrid>
        {products.map(({ node: product }, idx) => (
          <UIProductGridItem key={`${product.id}`}>
            <ProductCard.Component
              aspectRatio={aspectRatio}
              imgProps={{
                width: 150,
                height: 150,
                sizes: '30vw',
              }}
              {...ProductCard.props}
              bordered={bordered}
              showDiscountBadge={showDiscountBadge}
              product={product}
              index={pageSize * page + idx + 1}
            />
          </UIProductGridItem>
        ))}
      </UIProductGrid>
    </ProductGridSkeleton>
  )
}

export default memo(ProductGrid)
