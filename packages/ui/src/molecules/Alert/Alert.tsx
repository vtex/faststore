import React, { forwardRef } from 'react'

import type { AlertPureProps } from './AlertPure'
import AlertPure from './AlertPure'

export interface AlertProps extends Omit<AlertPureProps, 'onClose'> {
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
    <AlertPure ref={ref} testId={testId} {...otherProps}>
      {children}
    </AlertPure>
  )
})

export default Alert
