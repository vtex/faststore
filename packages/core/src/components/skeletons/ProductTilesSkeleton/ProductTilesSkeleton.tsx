import type { PropsWithChildren } from 'react'

import Tiles, { Tile } from 'src/components/ui/Tiles'

import { ProductTileSkeleton } from '.'

// TODO: // Replace it when items number become dynamically defined
const DEFAULT_ITEMS_NUMBER = 3
const DEFAULT_ITEMS_NUMBER_TWO = 2

const getRatio = (products: number, idx: number) => {
  const expandsFirstTile = products === DEFAULT_ITEMS_NUMBER && idx === 0

  const expandsFirstTwoTile =
    products === DEFAULT_ITEMS_NUMBER_TWO && (idx === 0 || idx === 1)

  if (expandsFirstTile || expandsFirstTwoTile) {
    return 5 / 3
  }

  return 3 / 4
}

interface ProductTilesSkeletonProps {
  loading?: boolean
}

function ProductTilesSkeleton({
  children,
  loading = true,
}: PropsWithChildren<ProductTilesSkeletonProps>) {
  return loading ? (
    <Tiles>
      {Array.from({ length: DEFAULT_ITEMS_NUMBER }, (_, index) => (
        <Tile key={String(index)}>
          <ProductTileSkeleton
            index={index + 1}
            aspectRatio={getRatio(DEFAULT_ITEMS_NUMBER, index)}
          />
        </Tile>
      ))}
    </Tiles>
  ) : (
    <>{children}</>
  )
}

export default ProductTilesSkeleton
