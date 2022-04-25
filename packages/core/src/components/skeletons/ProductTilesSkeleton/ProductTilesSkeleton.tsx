import type { PropsWithChildren } from 'react'

import Tiles, { Tile } from 'src/components/ui/Tiles'

import ProductTileSkeleton from './ProductTileSkeleton'

// TODO: // Replace it when items number become dynamically defined
const DEFAULT_ITEMS_NUMBER = 3

interface Props {
  loading?: boolean
  variant?: 'wide' | 'default'
}

function ProductTilesSkeleton({
  children,
  loading = true,
  variant = 'default',
}: PropsWithChildren<Props>) {
  return loading ? (
    <Tiles>
      {Array.from({ length: DEFAULT_ITEMS_NUMBER }, (_, index) => (
        <Tile key={String(index)}>
          <ProductTileSkeleton tileIndex={index + 1} variant={variant} />
        </Tile>
      ))}
    </Tiles>
  ) : (
    <>{children}</>
  )
}

export default ProductTilesSkeleton
