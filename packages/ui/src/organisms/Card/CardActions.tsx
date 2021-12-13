import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface CardActionsProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(
  function CardActions(
    { testId = 'store-card-actions', children, ...otherProps },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-store-card-actions
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default CardActions
