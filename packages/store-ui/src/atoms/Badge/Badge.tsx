import type { ReactNode, ForwardedRef } from 'react'
import React, { forwardRef } from 'react'

export interface BadgeProps {
  testId?: string
  children?: ReactNode
}

function Badge(
  { testId = 'store-badge', children }: BadgeProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <div ref={ref} data-testid={testId} data-store-badge>
      {children}
    </div>
  )
}

export default forwardRef<HTMLDivElement, BadgeProps>(Badge)
