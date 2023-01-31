import { Skeleton as UISkeleton } from '@faststore/ui'

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
        <UISkeleton size={{ width: 'auto', height: '100%' }} loading={true} />
      </div>
      <div
        data-fs-product-tile-skeleton-content
        data-fs-product-tile-skeleton-index={index}
      >
        <div
          data-fs-product-tile-skeleton-text
          data-fs-product-tile-skeleton-index={index}
        >
          <UISkeleton size={{ width: '100%', height: '1.5rem' }} />
          <div data-fs-product-tile-skeleton-price>
            <UISkeleton size={{ width: '100%', height: '1.5rem' }} />
          </div>
        </div>

        <div
          data-fs-product-tile-skeleton-badge
          data-fs-product-tile-skeleton-index={index}
        >
          <UISkeleton size={{ width: '100%', height: '2rem' }} border="pill" />
        </div>
      </div>
    </div>
  )
}

export default ProductTileSkeleton
