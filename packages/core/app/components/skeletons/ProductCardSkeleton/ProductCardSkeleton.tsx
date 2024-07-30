import { Skeleton as UISkeleton } from '@faststore/ui'

interface ProductCardSkeletonProps {
  /**
   * Specifies if the component should have a preset border.
   */
  bordered?: boolean
  /**
   * Specifies if the component is displayed in a section.
   */
  sectioned?: boolean
  /**
   * Control whether the button should be displayed.
   */
  displayButton?: boolean
  /**
   * Specifies the component variant.
   */
  variant?: 'default' | 'wide'
  /**
   * Specifies the ProductCard image's aspect ratio.
   */
  aspectRatio?: number
}

function ProductCardSkeleton({
  bordered,
  sectioned,
  displayButton,
  aspectRatio = 1,
  variant = 'default',
}: ProductCardSkeletonProps) {
  return (
    <div
      data-fs-product-card-skeleton
      data-fs-product-card-skeleton-variant={variant}
      data-fs-product-card-skeleton-bordered={bordered}
      data-fs-product-card-skeleton-sectioned={sectioned}
    >
      <div
        data-fs-product-card-skeleton-image
        style={
          {
            '--fs-product-card-skeleton-image-aspect-ratio': aspectRatio,
          } as React.CSSProperties
        }
      >
        <UISkeleton size={{ width: '100%', height: '100%' }} />
      </div>
      <div data-fs-product-card-skeleton-content>
        <UISkeleton
          data-fs-product-card-skeleton-text
          size={{ width: '90%', height: '1.5rem' }}
        />
        <UISkeleton
          data-fs-product-card-skeleton-text
          size={{ width: '70%', height: '1.5rem' }}
        />
        <UISkeleton
          data-fs-product-card-skeleton-badge
          size={{ width: '6rem', height: '2rem' }}
          border="pill"
        />
        {displayButton && (
          <UISkeleton
            data-fs-product-card-skeleton-button
            size={{ width: '6rem', height: '2rem' }}
            style={{ columnGap: '.75rem' }}
          />
        )}
      </div>
    </div>
  )
}

export default ProductCardSkeleton
