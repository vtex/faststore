import { useEffect, useId, useRef } from 'react'

import { ProductShelf as UIProductShelf } from '@faststore/ui'

import ProductShelfSkeleton from 'src/components/skeletons/ProductShelfSkeleton'
import { useViewItemListEvent } from 'src/sdk/analytics/hooks/useViewItemListEvent'
import { useProductsQuery } from 'src/sdk/product/useProductsQuery'
import { textToKebabCase } from 'src/utils/utilities'

import Carousel from '../../ui/Carousel'

import { Components } from 'src/components/ui/ProductShelf/Overrides'

const { ProductCard } = Components

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
  productCardConfiguration,
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
        <UIProductShelf>
          <Carousel id={titleId || id}>
            {productEdges.map((product, idx) => (
              <ProductCard
                bordered={productCardConfiguration?.bordered}
                showDiscountBadge={productCardConfiguration?.showDiscountBadge}
                key={`${product.node.id}`}
                product={product.node}
                index={idx + 1}
                aspectRatio={aspectRatio}
                imgProps={{
                  width: 216,
                  height: 216,
                  sizes: '(max-width: 768px) 42vw, 30vw',
                }}
              />
            ))}
          </Carousel>
        </UIProductShelf>
      </ProductShelfSkeleton>
    </>
  )
}

export default ProductShelf
