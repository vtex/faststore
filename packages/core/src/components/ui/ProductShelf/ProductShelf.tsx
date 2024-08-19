import { useEffect, useId, useRef } from 'react'

import ProductShelfSkeleton from 'src/components/skeletons/ProductShelfSkeleton'
import { useViewItemListEvent } from 'src/sdk/analytics/hooks/useViewItemListEvent'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import { useProductsQuery } from 'src/sdk/product/useProductsQuery'
import { textToKebabCase } from 'src/utils/utilities'

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
}

function ProductShelf({
  title,
  inView,
  productCardConfiguration: { bordered, showDiscountBadge } = {},
  numberOfItems,
  itemsPerPage = 5,
  taxesConfiguration = {},
  ...otherProps
}: ProductShelfProps) {
  const {
    ProductShelf: ProductShelfWrapper,
    __experimentalCarousel: Carousel,
    __experimentalProductCard: ProductCard,
  } = useOverrideComponents<'ProductShelf' | 'CrossSellingShelf'>()
  const titleId = textToKebabCase(title)
  const id = useId()
  const viewedOnce = useRef(false)
  const data = useProductsQuery({ first: numberOfItems, ...otherProps })
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

  if (products?.edges.length === 0) {
    return null
  }

  return (
    <>
      <h2 className="text__title-section layout__content">{title}</h2>
      <ProductShelfSkeleton
        aspectRatio={aspectRatio}
        loading={products === undefined}
        itemsPerPage={itemsPerPage}
      >
        <ProductShelfWrapper.Component {...ProductShelfWrapper.props}>
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
    </>
  )
}

export default ProductShelf
