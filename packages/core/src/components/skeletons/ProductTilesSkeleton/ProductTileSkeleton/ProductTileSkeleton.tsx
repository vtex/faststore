import { Skeleton as UISkeleton } from '@faststore/ui'

interface ProductTileSkeletonProps {
  index: number
  aspectRatio?: number
}

function ProductTileSkeleton({
  index,
  aspectRatio = 1,
}: ProductTileSkeletonProps) {
  return (
    <div
      data-fs-product-tile-skeleton
      data-fs-product-tile-skeleton-index={index}
    >
      <div
        data-fs-product-tile-skeleton-image
        data-fs-product-tile-skeleton-index={index}
        style={
          {
            '--fs-product-tile-skeleton-image-aspect-ratio': aspectRatio,
          } as React.CSSProperties
        }
      >
        <UISkeleton size={{ width: 'auto', height: '100%' }} loading={true} />
      </div>
      <div
        data-fs-product-tile-skeleton-content
        data-fs-product-tile-skeleton-index={index}
      >
        <div data-fs-product-tile-skeleton-heading>
          <div
            data-fs-product-tile-skeleton-text
            data-fs-product-tile-skeleton-index={index}
          >
            <UISkeleton size={{ width: '70%', height: '1.5rem' }} />
          </div>
          <div data-fs-product-tile-skeleton-price>
            <UISkeleton size={{ width: '60%', height: '1.5rem' }} />
          </div>
        </div>

        <div
          data-fs-product-tile-skeleton-badge
          data-fs-product-tile-skeleton-index={index}
        >
          <UISkeleton size={{ width: '6rem', height: '2rem' }} border="pill" />
        </div>
      </div>
    </div>
  )
}

export default ProductTileSkeleton
