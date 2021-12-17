import type { ReactNode, HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  children?: ReactNode
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(function Badge(
  { testId = 'store-badge', children, ...otherProps }: BadgeProps,
  ref
) {
  return (
    <div ref={ref} data-store-badge data-testid={testId} {...otherProps}>
      {children}
    </div>
  )
})

export default Badge
