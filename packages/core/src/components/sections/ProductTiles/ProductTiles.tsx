import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

import type { ProductsQueryQueryVariables } from '@generated/graphql'
import ProductCard from 'src/components/product/ProductCard'
import ProductTilesSkeleton from 'src/components/skeletons/ProductTilesSkeleton'
import Tiles, { Tile } from 'src/components/ui/Tiles'
import { useViewItemListEvent } from 'src/sdk/analytics/hooks/useViewItemListEvent'
import { useProductsQuery } from 'src/sdk/product/useProductsQuery'

import Section from '../Section'

import styles from './section.module.scss'

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
    return 5 / 3
  }

  return 3 / 4
}

const getSizes = (products: number, idx: number) => {
  const expandsFirstTile =
    products === NUMBER_ITEMS_TO_EXPAND_FIRST && idx === 0

  const expandsFirstTwoTile =
    products === NUMBER_ITEMS_TO_EXPAND_FIRST_TWO && (idx === 0 || idx === 1)

  if (expandsFirstTile || expandsFirstTwoTile) {
    return {
      width: 594,
      height: 364,
    }
  }

  return {
    width: 284,
    height: 364,
  }
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
    <Section
      className={`${styles.section} section-product-tiles layout__section`}
      ref={ref}
    >
      <h2 className="text__title-section layout__content">{title}</h2>
      <ProductTilesSkeleton loading={!products}>
        <Tiles>
          {productEdges.map((product, idx) => (
            <Tile key={product.node.id}>
              <ProductCard
                data-testid="tile-card"
                product={product.node}
                index={idx + 1}
                variant="wide"
                aspectRatio={getRatio(productEdges.length, idx)}
                imgProps={getSizes(productEdges.length, idx)}
              />
            </Tile>
          ))}
        </Tiles>
      </ProductTilesSkeleton>
    </Section>
  )
}

export default ProductTiles
