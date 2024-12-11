import {
  ProductGrid as UIProductGrid,
  ProductGridItem as UIProductGridItem,
} from '@faststore/ui'
import type { ClientManyProductsQueryQuery } from '@generated/graphql'
import ProductGridSkeleton from 'src/components/skeletons/ProductGridSkeleton'
import { ProductCardProps } from '../ProductCard'

import { memo } from 'react'
import ViewportObserver from 'src/components/cms/ViewportObserver'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import useScreenResize from 'src/sdk/ui/useScreenResize'

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
    'showDiscountBadge' | 'bordered' | 'taxesConfiguration' | 'sponsoredLabel'
  >
  /**
   * Identify the number of firstPage
   */
  firstPage?: number
}

function ProductGrid({
  products,
  page,
  pageSize,
  productCard: {
    showDiscountBadge,
    bordered,
    taxesConfiguration,
    sponsoredLabel,
  } = {},
  firstPage,
}: Props) {
  const { isMobile } = useScreenResize()
  const { __experimentalProductCard: ProductCard } =
    useOverrideComponents<'ProductGallery'>()

  const aspectRatio = 1
  const isGridWithViewportObserver = isMobile && firstPage === page

  return (
    <ProductGridSkeleton
      aspectRatio={aspectRatio}
      loading={products.length === 0}
    >
      <UIProductGrid>
        {isGridWithViewportObserver ? (
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
                  sponsoredLabel={sponsoredLabel}
                />
              </UIProductGridItem>
            ))}
            <></>
            <ViewportObserver sectionName="UIProductGrid-out-viewport">
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
                    sponsoredLabel={sponsoredLabel}
                  />
                </UIProductGridItem>
              ))}
            </ViewportObserver>
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
                  sponsoredLabel={sponsoredLabel}
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
