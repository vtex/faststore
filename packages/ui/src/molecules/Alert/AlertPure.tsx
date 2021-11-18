import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface AlertPureProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

const AlertPure = forwardRef<HTMLDivElement, AlertPureProps>(function AlertPure(
  { testId = 'store-alert', children, ...otherProps },
  ref
) {
  return (
    <div
      ref={ref}
      role="alert"
      data-store-alert
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </div>
  )
})

export default AlertPure
