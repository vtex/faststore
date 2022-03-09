import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
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

export default Alert
