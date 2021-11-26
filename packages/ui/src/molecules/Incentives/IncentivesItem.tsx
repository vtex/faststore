import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface IncentivesItemProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

const IncentivesItem = forwardRef<HTMLDivElement, IncentivesItemProps>(
  function IncentivesItem(
    { testId = 'store-incentives-item', children, ...otherProps },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-store-incentives-item
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default IncentivesItem
