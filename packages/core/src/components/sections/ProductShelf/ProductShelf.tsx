import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

import {
  ProductShelf as UIProductShelf,
  ProductShelfItem,
  ProductShelfItems,
} from '@faststore/ui'

import { useViewItemListEvent } from 'src/sdk/analytics/hooks/useViewItemListEvent'
import ProductShelfSkeleton from 'src/components/skeletons/ProductShelfSkeleton'
import { useProductsQuery } from 'src/sdk/product/useProductsQuery'
import type { ProductsQueryQueryVariables } from '@generated/graphql'

import ProductCard from '../../product/ProductCard'
import Section from '../Section'

interface ProductShelfProps extends Partial<ProductsQueryQueryVariables> {
  title: string
  withDivisor?: boolean
}

function ProductShelf({
  title,
  withDivisor = false,
  ...variables
}: ProductShelfProps) {
  const viewedOnce = useRef(false)
  const { ref, inView } = useInView()
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
    <Section
      className={`layout__section ${withDivisor ? 'section__divisor' : ''}`}
      ref={ref}
    >
      <h2 className="text__title-section layout__content">{title}</h2>
      <ProductShelfSkeleton
        aspectRatio={aspectRatio}
        loading={products === undefined}
      >
        <UIProductShelf>
          <ProductShelfItems className="layout__content">
            {productEdges.map((product, idx) => (
              <ProductShelfItem key={`${product.node.id}`}>
                <ProductCard
                  product={product.node}
                  index={idx + 1}
                  aspectRatio={aspectRatio}
                />
              </ProductShelfItem>
            ))}
          </ProductShelfItems>
        </UIProductShelf>
      </ProductShelfSkeleton>
    </Section>
  )
}

export default ProductShelf
