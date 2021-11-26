import type { MouseEvent, ReactNode } from 'react'
import React, { forwardRef } from 'react'

import type { AlertPureProps } from './AlertPure'
import AlertPure from './AlertPure'
import Icon from '../../atoms/Icon'

export interface AlertProps extends Omit<AlertPureProps, 'onClose'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string

  /**
   * A React component that will be rendered as an icon.
   */
  icon?: ReactNode

  /**
   * This function is called whenever the user hits the close button.
   */
  onClose?: (event: MouseEvent) => void
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { testId = 'store-alert', children, icon, ...otherProps },
  ref
) {
  return (
    <AlertPure ref={ref} testId={testId} {...otherProps}>
      {icon && <Icon component={icon} data-alert-icon />}

      {children}
    </AlertPure>
  )
})

export default Alert
