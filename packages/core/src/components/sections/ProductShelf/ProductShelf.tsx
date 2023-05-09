import { useEffect, useId, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

import { ProductShelf as UIProductShelf } from '@faststore/ui'

import type { ProductsQueryQueryVariables } from '@generated/graphql'
import ProductShelfSkeleton from 'src/components/skeletons/ProductShelfSkeleton'
import { useViewItemListEvent } from 'src/sdk/analytics/hooks/useViewItemListEvent'
import { useProductsQuery } from 'src/sdk/product/useProductsQuery'
import { textToKebabCase } from 'src/utils/utilities'

import Carousel from '../../ui/Carousel'
import Section from '../Section'
import { Components } from './Overrides'
const { ProductCard } = Components

import styles from './section.module.scss'

interface ProductShelfProps extends Partial<ProductsQueryQueryVariables> {
  title: string
  withDivisor?: boolean
}

function ProductShelf({
  title,
  withDivisor = false,
  ...variables
}: ProductShelfProps) {
  const titleId = textToKebabCase(title)
  const id = useId()
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
      className={`${styles.section} section-product-shelf layout__section ${
        withDivisor ? 'section__divisor' : ''
      }`}
      ref={ref}
    >
      <h2 className="text__title-section layout__content">{title}</h2>
      <ProductShelfSkeleton
        aspectRatio={aspectRatio}
        loading={products === undefined}
      >
        <UIProductShelf>
          <Carousel id={titleId || id}>
            {productEdges.map((product, idx) => (
              <ProductCard
                bordered
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
    </Section>
  )
}

export default ProductShelf
