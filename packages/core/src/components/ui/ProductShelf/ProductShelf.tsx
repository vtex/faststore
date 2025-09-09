import dynamic from 'next/dynamic'
import { useEffect, useId, useRef } from 'react'

import { useViewItemListEvent } from 'src/sdk/analytics/hooks/useViewItemListEvent'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import { useProductsQuery } from 'src/sdk/product/useProductsQuery'
import { textToKebabCase } from 'src/utils/utilities'
import { useDeliveryPromiseFacets } from 'src/sdk/deliveryPromise/useDeliveryPromiseFacets'
import deepmerge from 'deepmerge'

import type { ProductSummary_ProductFragment } from '@generated/graphql'

const ProductShelfSkeleton = dynamic(
  () =>
    /* webpackChunkName: "ProductShelfSkeleton" */
    import('src/components/skeletons/ProductShelfSkeleton')
)

type Sort =
  | 'discount_desc'
  | 'name_asc'
  | 'name_desc'
  | 'orders_desc'
  | 'price_asc'
  | 'price_desc'
  | 'release_desc'
  | 'score_desc'

export type ProductShelfProps = {
  title: string
  numberOfItems?: number
  itemsPerPage?: number
  after?: string
  sort?: Sort
  term?: string
  selectedFacets?: {
    key: string
    value: string
  }[]
  taxesConfiguration?: {
    usePriceWithTaxes?: boolean
    taxesLabel?: string
  }
  productCardConfiguration?: {
    showDiscountBadge?: boolean
    bordered?: boolean
  }
  inView: boolean
  products?: ProductSummary_ProductFragment[]
}

function ProductShelf(props: ProductShelfProps) {
  const {
    title,
    inView,
    productCardConfiguration: { bordered, showDiscountBadge } = {},
    numberOfItems,
    itemsPerPage = 5,
    taxesConfiguration = {},
    products: cmsProducts = [],
    ...otherProps
  } = props
  const {
    ProductShelf: ProductShelfWrapper,
    __experimentalCarousel: Carousel,
    __experimentalProductCard: ProductCard,
  } = useOverrideComponents<'ProductShelf' | 'CrossSellingShelf'>()
  const titleId = textToKebabCase(title)
  const id = useId()
  const viewedOnce = useRef(false)
  const { deliveryFacets } = useDeliveryPromiseFacets()

  const data = useProductsQuery(
    {
      first: numberOfItems,
      selectedFacets: deepmerge(otherProps.selectedFacets, deliveryFacets, {
        arrayMerge: overwriteMerge,
      }),
      ...otherProps,
      after: otherProps.after?.toString(),
    },
    { suspense: false }
  )

  const products = data?.search?.products
  const productEdges = products?.edges ?? []
  const aspectRatio = 1

  const { sendViewItemListEvent } = useViewItemListEvent({
    products: productEdges,
    title,
    page: 0,
    pageSize: 0,
  })

  useEffect(() => {
    if (inView && !viewedOnce.current && productEdges.length) {
      sendViewItemListEvent()

      viewedOnce.current = true
    }
  }, [inView, productEdges.length, sendViewItemListEvent])

  if (
    products?.edges.length === 0 &&
    (!cmsProducts || cmsProducts.length === 0)
  ) {
    return null
  }

  const productShelfAttributes: ProductShelfProps = {
    ...props,
    products: cmsProducts.concat(productEdges.map((edge) => edge.node)),
  }

  return (
    <ProductShelfSkeleton
      aspectRatio={aspectRatio}
      loading={products === undefined}
      itemsPerPage={itemsPerPage}
    >
      <ProductShelfWrapper.Component
        {...productShelfAttributes}
        {...ProductShelfWrapper.props}
      >
        <Carousel.Component
          id={titleId || id}
          itemsPerPage={itemsPerPage}
          {...Carousel.props}
        >
          {productEdges.map((product, idx) => (
            <ProductCard.Component
              aspectRatio={aspectRatio}
              imgProps={{
                width: 216,
                height: 216,
                sizes: '(max-width: 768px) 42vw, 30vw',
              }}
              {...ProductCard.props}
              bordered={bordered ?? ProductCard.props.bordered}
              showDiscountBadge={
                showDiscountBadge ?? ProductCard.props.showDiscountBadge
              }
              taxesConfiguration={taxesConfiguration}
              // Dynamic props shouldn't be overridable
              // This decision can be reviewed later if needed
              key={`${product.node.id}`}
              product={product.node}
              index={idx + 1}
            />
          ))}
        </Carousel.Component>
      </ProductShelfWrapper.Component>
    </ProductShelfSkeleton>
  )
}

export default ProductShelf

// Array merging strategy from deepmerge that makes client arrays overwrite server array
const overwriteMerge = (_: any[], clientArray: any[]) => clientArray
