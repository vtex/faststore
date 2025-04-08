import {
  ProductGrid as UIProductGrid,
  ProductGridItem as UIProductGridItem,
} from '@faststore/ui'
import type { ClientManyProductsQueryQuery } from '@generated/graphql'
import ProductGridSkeleton from 'src/components/skeletons/ProductGridSkeleton'
import type { ProductCardProps } from '../ProductCard'

import { memo } from 'react'
import ViewportObserver from 'src/components/cms/ViewportObserver'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import useScreenResize from 'src/sdk/ui/useScreenResize'
import ProductSentinel from 'src/sdk/product/ProductSentinel'

interface Props {
  /**
   * Products listed on the grid.
   */
  products: ClientManyProductsQueryQuery['search']['products']['edges']
  /**
   * The page's number that is being rendered.
   */
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
   * Determine if the current page is the first page.
   */
  firstPage?: number
  /**
   * Title for the `ProductGrid` component that will be send to GA events.
   */
  title?: string
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
  title,
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
          // In mobile, the ProductGrid initially renders the first 2 items, the rest of the items are rendered when they come into the viewport.
          <>
            {products.slice(0, 2).map(({ node: product }, idx) => (
              <UIProductGridItem key={`${product.id}`}>
                <ProductSentinel
                  product={product}
                  title={title}
                  page={page}
                  pageSize={pageSize}
                >
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
                </ProductSentinel>
              </UIProductGridItem>
            ))}
            <ViewportObserver sectionName="UIProductGrid-out-viewport">
              {products.slice(2).map(({ node: product }, idx) => (
                <UIProductGridItem key={`${product.id}`}>
                  <ProductSentinel
                    product={product}
                    title={title}
                    page={page}
                    pageSize={pageSize}
                  >
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
                  </ProductSentinel>
                </UIProductGridItem>
              ))}
            </ViewportObserver>
          </>
        ) : (
          <>
            {products.map(({ node: product }, idx) => (
              <UIProductGridItem key={`${product.id}`}>
                <ProductSentinel
                  product={product}
                  title={title}
                  page={page}
                  pageSize={pageSize}
                >
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
                </ProductSentinel>
              </UIProductGridItem>
            ))}
          </>
        )}
      </UIProductGrid>
    </ProductGridSkeleton>
  )
}

export default memo(ProductGrid)
