import type { PropsWithChildren } from 'react'

import Shimmer from '../Shimmer'

type ElementVariant = 'text' | 'button' | 'image' | 'badge'

interface Props {
  loading?: boolean
  shimmer?: boolean
  type: ElementVariant
}

function SkeletonElement({
  type,
  children,
  loading = true,
  shimmer = false,
}: PropsWithChildren<Props>) {
  return loading ? (
    <div data-store-skeleton-element data-shimmer={shimmer}>
      <div data-skeleton-element-content data-element-variant={type} />
      {shimmer && <Shimmer />}
    </div>
  ) : (
    <>{children}</>
  )
}

export default SkeletonElement
