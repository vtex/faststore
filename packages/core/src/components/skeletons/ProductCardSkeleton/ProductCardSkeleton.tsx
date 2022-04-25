import Shimmer from '../Shimmer'
import SkeletonElement from '../SkeletonElement'

interface Props {
  bordered?: boolean
  sectioned?: boolean
  showActions?: boolean
  variant?: 'wide' | 'default'
}

function ProductCardSkeleton({
  bordered,
  sectioned = false,
  showActions = false,
  variant = 'default',
}: Props) {
  return (
    <div
      data-store-product-card-skeleton
      data-bordered={bordered}
      data-variant={variant}
    >
      <div data-product-card-skeleton-image data-sectioned={sectioned}>
        <SkeletonElement type="image" />
      </div>
      <div data-product-card-skeleton-content>
        <SkeletonElement type="text" />
        <SkeletonElement type="text" />
        <SkeletonElement type="badge" />
        {showActions && <SkeletonElement type="button" />}
      </div>
      <Shimmer />
    </div>
  )
}

export default ProductCardSkeleton
