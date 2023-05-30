import { useEffect, useId, useRef } from 'react'

import ProductShelfSkeleton from 'src/components/skeletons/ProductShelfSkeleton'
import { useViewItemListEvent } from 'src/sdk/analytics/hooks/useViewItemListEvent'
import { useProductsQuery } from 'src/sdk/product/useProductsQuery'
import { textToKebabCase } from 'src/utils/utilities'

import Carousel from '../../ui/Carousel'

import {
  Components,
  Props,
} from 'src/components/sections/ProductShelf/Overrides'

const { ProductShelf: ProductShelfWrapper, ProductCard } = Components

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
  first?: number
  after?: string
  sort?: Sort
  term?: string
  selectedFacets?: {
    key: string
    value: string
  }[]
  productCardConfiguration?: {
    showDiscountBadge: boolean
    bordered: boolean
  }
  inView: boolean
}

function ProductShelf({
  title,
  inView,
  productCardConfiguration: {
    bordered = Props['ProductCard'].bordered,
    showDiscountBadge = Props['ProductCard'].showDiscountBadge,
  },
  ...variables
}: ProductShelfProps) {
  const titleId = textToKebabCase(title)
  const id = useId()
  const viewedOnce = useRef(false)
  const products = useProductsQuery(variables)
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
        <ProductShelfWrapper {...Props['ProductShelfWrapper']}>
          <Carousel id={titleId || id}>
            {productEdges.map((product, idx) => (
              <ProductCard
                aspectRatio={aspectRatio}
                imgProps={{
                  width: 216,
                  height: 216,
                  sizes: '(max-width: 768px) 42vw, 30vw',
                }}
                {...Props['ProductCard']}
                bordered={bordered}
                showDiscountBadge={showDiscountBadge}
                // Dynamic props, shouldn't be overridable
                // This decision can be reviewed later if needed
                key={`${product.node.id}`}
                product={product.node}
                index={idx + 1}
              />
            ))}
          </Carousel>
        </ProductShelfWrapper>
      </ProductShelfSkeleton>
    </>
  )
}

export default ProductShelf
