import {
  ProductGrid as UIProductGrid,
  ProductGridItem as UIProductGridItem,
} from '@faststore/ui'
import type { ClientManyProductsQueryQuery } from '@generated/graphql'
import ProductGridSkeleton from 'src/components/skeletons/ProductGridSkeleton'
import { ProductCardProps } from '../ProductCard'

import { memo } from 'react'
import Intersection from 'src/components/cms/Intersection'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'

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
  productCard?: Pick<
    ProductCardProps,
    'showDiscountBadge' | 'bordered' | 'taxesConfiguration'
  >
  firstPage?: number
}

function ProductGrid({
  products,
  page,
  pageSize,
  productCard: { showDiscountBadge, bordered, taxesConfiguration } = {},
  firstPage,
}: Props) {
  const { __experimentalProductCard: ProductCard } =
    useOverrideComponents<'ProductGallery'>()
  const aspectRatio = 1

  const isFirstPage = firstPage === page
  // TODO check if isMobile

  return (
    <ProductGridSkeleton
      aspectRatio={aspectRatio}
      loading={products.length === 0}
    >
      <UIProductGrid>
        {isFirstPage ? (
          <>
            {products.slice(0, 2).map(({ node: product }, idx) => (
              <UIProductGridItem key={`${product.id}`}>
                <ProductCard.Component
                  aspectRatio={aspectRatio}
                  imgProps={{
                    width: 150,
                    height: 150,
                    sizes: '30vw',
                    loading: 'eager',
                  }}
                  {...ProductCard.props}
                  bordered={bordered ?? ProductCard.props.bordered}
                  showDiscountBadge={
                    showDiscountBadge ?? ProductCard.props.showDiscountBadge
                  }
                  product={product}
                  index={pageSize * page + idx + 1}
                  taxesConfiguration={taxesConfiguration}
                />
              </UIProductGridItem>
            ))}
            <Intersection name="UIProductGrid-out-viewport">
              {products.slice(2).map(({ node: product }, idx) => (
                <UIProductGridItem key={`${product.id}`}>
                  <ProductCard.Component
                    aspectRatio={aspectRatio}
                    imgProps={{
                      width: 150,
                      height: 150,
                      sizes: '30vw',
                      loading: 'lazy',
                    }}
                    {...ProductCard.props}
                    bordered={bordered ?? ProductCard.props.bordered}
                    showDiscountBadge={
                      showDiscountBadge ?? ProductCard.props.showDiscountBadge
                    }
                    product={product}
                    index={pageSize * page + idx + 1}
                    taxesConfiguration={taxesConfiguration}
                  />
                </UIProductGridItem>
              ))}
            </Intersection>
          </>
        ) : (
          <>
            {products.map(({ node: product }, idx) => (
              <UIProductGridItem key={`${product.id}`}>
                <ProductCard.Component
                  aspectRatio={aspectRatio}
                  imgProps={{
                    width: 150,
                    height: 150,
                    sizes: '30vw',
                    loading: idx === 0 ? 'eager' : 'lazy',
                  }}
                  {...ProductCard.props}
                  bordered={bordered ?? ProductCard.props.bordered}
                  showDiscountBadge={
                    showDiscountBadge ?? ProductCard.props.showDiscountBadge
                  }
                  product={product}
                  index={pageSize * page + idx + 1}
                  taxesConfiguration={taxesConfiguration}
                />
              </UIProductGridItem>
            ))}
          </>
        )}
      </UIProductGrid>
    </ProductGridSkeleton>
  )
}

export default memo(ProductGrid)
