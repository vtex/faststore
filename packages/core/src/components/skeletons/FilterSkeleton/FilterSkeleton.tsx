import type { PropsWithChildren } from 'react'

import { Skeleton as UISkeleton } from '@faststore/ui'
interface FilterSkeletonProps {
  /**
   * Control whether skeleton should be visible or not.
   */
  loading?: boolean
}

function FilterSkeleton({
  children,
  loading = true,
}: PropsWithChildren<FilterSkeletonProps>) {
  return loading ? (
    <div data-fs-filter-skeleton>
      <UISkeleton
        data-fs-filter-skeleton-text
        size={{ width: '100%', height: '1.5rem' }}
      />

      <div data-fs-filter-skeleton-content>
        <UISkeleton
          data-fs-filter-skeleton-text
          size={{ width: '100%', height: '1.5rem' }}
          shimmer={false}
        />
        <UISkeleton
          data-fs-filter-skeleton-text
          size={{ width: '100%', height: '1.5rem' }}
          shimmer={false}
        />
        <UISkeleton
          data-fs-filter-skeleton-text
          size={{ width: '100%', height: '1.5rem' }}
          shimmer={false}
        />
      </div>
    </div>
  ) : (
    <>{children}</>
  )
}

export default FilterSkeleton
