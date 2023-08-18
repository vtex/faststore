import { useEffect, useId, useRef } from 'react'

import ProductShelfSkeleton from 'src/components/skeletons/ProductShelfSkeleton'
import { useViewItemListEvent } from 'src/sdk/analytics/hooks/useViewItemListEvent'
import { textToKebabCase } from 'src/utils/utilities'

import { ClientProductsQueryQuery } from '@generated/graphql'
import {
  ProductShelf as ProductShelfWrapper,
  __experimentalCarousel as Carousel,
  __experimentalProductCard as ProductCard,
} from 'src/components/sections/ProductShelf/Overrides'

export type ProductShelfProps = {
  title: string
  productCardConfiguration?: {
    showDiscountBadge?: boolean
    bordered?: boolean
  }
  inView: boolean
  products: ClientProductsQueryQuery['search']['products']
}

function ProductShelf({
  title,
  inView,
  productCardConfiguration: {
    bordered = ProductCard.props.bordered,
    showDiscountBadge = ProductCard.props.showDiscountBadge,
  } = {},
  products,
}: ProductShelfProps) {
  const titleId = textToKebabCase(title)
  const id = useId()
  const viewedOnce = useRef(false)
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
      >
        <ProductShelfWrapper.Component {...ProductShelfWrapper.props}>
          <Carousel.Component id={titleId || id} {...Carousel.props}>
            {productEdges.map((product, idx) => (
              <ProductCard.Component
                aspectRatio={aspectRatio}
                imgProps={{
                  width: 216,
                  height: 216,
                  sizes: '(max-width: 768px) 42vw, 30vw',
                }}
                {...ProductCard.props}
                bordered={bordered}
                showDiscountBadge={showDiscountBadge}
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
