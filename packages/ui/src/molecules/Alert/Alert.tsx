import type { MouseEvent, ReactNode } from 'react'
import React, { forwardRef } from 'react'

import type { AlertPureProps } from './AlertPure'
import AlertPure from './AlertPure'
import Icon from '../../atoms/Icon'
import Button from '../../atoms/Button'

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
   * Boolean that controls the close button.
   */
  dismissible?: boolean

  /**
   * This function is called whenever the user hits the close button.
   */
  onClose?: (event: MouseEvent) => void
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    testId = 'store-alert',
    children,
    icon,
    dismissible,
    onClose,
    ...otherProps
  },
  ref
) {
  const handleClose = (event: MouseEvent) => {
    if (event.defaultPrevented) {
      return
    }

    event.stopPropagation()
    onClose?.(event)
  }

  return (
    <AlertPure ref={ref} testId={testId} {...otherProps}>
      {icon && <Icon component={icon} />}

      {children}

      {dismissible && (
        <Button
          aria-label="Close"
          data-store-alert-button
          data-testid={`${testId}-button`}
          onClick={handleClose}
        >
          <span>&times;</span>
        </Button>
      )}
    </AlertPure>
  )
})

export default Alert
