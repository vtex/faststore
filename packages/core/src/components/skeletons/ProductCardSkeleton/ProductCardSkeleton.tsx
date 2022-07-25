import Shimmer from '../Shimmer'
import Skeleton from '../Skeleton'
import styles from './product-card-skeleton.module.scss'

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
}

function ProductCardSkeleton({
  bordered,
  sectioned,
  displayButton,
  variant = 'default',
}: ProductCardSkeletonProps) {
  return (
    <div
      className={styles.fsProductCardSkeleton}
      data-fs-product-card-skeleton
      data-fs-product-card-skeleton-variant={variant}
      data-fs-product-card-skeleton-bordered={bordered}
      data-fs-product-card-skeleton-sectioned={sectioned}
    >
      <div data-fs-product-card-skeleton-image>
        <Skeleton variant="image" />
      </div>
      <div data-fs-product-card-skeleton-content>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="badge" />
        {displayButton && <Skeleton variant="button" />}
      </div>
      <Shimmer />
    </div>
  )
}

export default ProductCardSkeleton
