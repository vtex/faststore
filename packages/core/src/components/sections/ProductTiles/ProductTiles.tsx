import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

import { useViewItemListEvent } from 'src/sdk/analytics/hooks/useViewItemListEvent'
import Tiles, { Tile } from 'src/components/ui/Tiles'
import ProductCard from 'src/components/product/ProductCard'
import ProductTilesSkeleton from 'src/components/skeletons/ProductTilesSkeleton'
import { useProductsQuery } from 'src/sdk/product/useProductsQuery'
import type { ProductsQueryQueryVariables } from '@generated/graphql'

import Section from '../Section'

interface ProductTilesProps extends Partial<ProductsQueryQueryVariables> {
  title: string
}

const NUMBER_ITEMS_TO_EXPAND_FIRST = 3
const NUMBER_ITEMS_TO_EXPAND_FIRST_TWO = 2

const getRatio = (products: number, idx: number) => {
  const expandsFirstTile =
    products === NUMBER_ITEMS_TO_EXPAND_FIRST && idx === 0

  const expandsFirstTwoTile =
    products === NUMBER_ITEMS_TO_EXPAND_FIRST_TWO && (idx === 0 || idx === 1)

  if (expandsFirstTile || expandsFirstTwoTile) {
    return 4 / 3
  }

  return 3 / 4
}

const ProductTiles = ({ title, ...variables }: ProductTilesProps) => {
  const viewedOnce = useRef(false)
  const { ref, inView } = useInView()
  const products = useProductsQuery(variables)
  const productEdges = products?.edges ?? []

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
    <Section className="layout__section layout__content" ref={ref}>
      <h2 className="text__title-section">{title}</h2>
      <div>
        <ProductTilesSkeleton variant="wide" loading={!products}>
          <Tiles>
            {productEdges.map((product, idx) => (
              <Tile key={product.node.id}>
                <ProductCard
                  data-testid="tile-card"
                  product={product.node}
                  index={idx + 1}
                  variant="wide"
                  aspectRatio={getRatio(productEdges.length, idx)}
                />
              </Tile>
            ))}
          </Tiles>
        </ProductTilesSkeleton>
      </div>
    </Section>
  )
}

export default ProductTiles
