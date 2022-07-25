import Skeleton from 'src/components/skeletons/Skeleton'
import Shimmer from 'src/components/skeletons/Shimmer'

import styles from './product-tile-skeleton.module.scss'

interface ProductTileSkeletonProps {
  index: number
  bordered?: boolean
  variant?: 'wide' | 'default'
}

function ProductTileSkeleton({
  index,
  bordered,
  variant = 'default',
}: ProductTileSkeletonProps) {
  return (
    <div
      data-fs-product-tile-skeleton
      className={styles.fsProductTileSkeleton}
      data-fs-product-tile-skeleton-index={index}
      data-fs-product-tile-skeleton-variant={variant}
      data-fs-product-tile-skeleton-bordered={bordered}
    >
      <div
        data-fs-product-tile-skeleton-image
        data-fs-product-tile-skeleton-index={index}
      >
        <Skeleton variant="image" />
      </div>
      <div
        data-fs-product-tile-skeleton-content
        data-fs-product-tile-skeleton-index={index}
      >
        <div
          data-fs-product-tile-skeleton-text
          data-fs-product-tile-skeleton-index={index}
        >
          <Skeleton variant="text" />
          <div data-fs-product-tile-skeleton-price>
            <Skeleton variant="text" />
          </div>
        </div>

        <div
          data-fs-product-tile-skeleton-badge
          data-fs-product-tile-skeleton-index={index}
        >
          <Skeleton variant="badge" />
        </div>
      </div>
      <Shimmer />
    </div>
  )
}

export default ProductTileSkeleton
