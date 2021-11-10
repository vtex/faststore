import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Form(
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
