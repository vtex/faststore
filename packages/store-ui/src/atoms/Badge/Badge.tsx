import type { ReactNode, ForwardedRef } from 'react'
import React, { forwardRef } from 'react'

export interface BadgeProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  children?: ReactNode
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(function Badge(
  { testId = 'store-badge', children }: BadgeProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <div ref={ref} data-testid={testId} data-store-badge>
      {children}
    </div>
  )
})

export default Badge
