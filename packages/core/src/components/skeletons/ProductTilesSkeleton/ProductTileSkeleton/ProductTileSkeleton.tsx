import Shimmer from 'src/components/skeletons/Shimmer'
import SkeletonElement from 'src/components/skeletons/SkeletonElement'

interface Props {
  tileIndex: number
  bordered?: boolean
  variant?: 'wide' | 'default'
}

function ProductTileSkeleton({
  tileIndex,
  bordered,
  variant = 'default',
}: Props) {
  return (
    <div
      data-store-product-tile-skeleton
      data-tile-index={tileIndex}
      data-bordered={bordered}
      data-variant={variant}
    >
      <div data-product-tile-skeleton-image data-tile-index={tileIndex}>
        <SkeletonElement type="image" />
      </div>
      <div data-product-tile-skeleton-content data-tile-index={tileIndex}>
        <div data-product-tile-skeleton-text data-tile-index={tileIndex}>
          <SkeletonElement type="text" />
          <div data-product-tile-skeleton-price>
            <SkeletonElement type="text" />
          </div>
        </div>

        <div data-product-tile-skeleton-badge data-tile-index={tileIndex}>
          <SkeletonElement type="badge" />
        </div>
      </div>
      <Shimmer />
    </div>
  )
}

export default ProductTileSkeleton
