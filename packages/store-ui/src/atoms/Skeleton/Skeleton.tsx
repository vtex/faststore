import React, { forwardRef } from 'react'

export interface SkeletonProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { testId = 'store-skeleton', ...props },
  ref
) {
  return (
    <div ref={ref} data-store-skeleton-container data-testid={testId}>
      <div data-store-skeleton {...props} />
    </div>
  )
})

export default Skeleton
