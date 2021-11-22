import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface IncentivesPureProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

const IncentivesPure = forwardRef<HTMLDivElement, IncentivesPureProps>(
  function IncentivesPure(
    { testId = 'store-incentives', children, ...otherProps },
    ref
  ) {
    return (
      <div ref={ref} data-store-incentives data-testid={testId} {...otherProps}>
        {children}
      </div>
    )
  }
)

export default IncentivesPure
