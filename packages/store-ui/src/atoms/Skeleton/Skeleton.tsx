import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { testId = 'store-skeleton', ...props },
  ref
) {
  return <div ref={ref} data-store-skeleton data-testid={testId} {...props} />
})

export default Skeleton
