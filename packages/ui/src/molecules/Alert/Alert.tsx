import type { HTMLAttributes, MouseEvent, ReactNode } from 'react'
import React, { forwardRef } from 'react'

import Icon from '../../atoms/Icon'
import Button from '../../atoms/Button'

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onClose' | 'role'> {
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
   * Function that is triggered when the alert is closed.
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
    onClose?.(event)
  }

  return (
    <div
      ref={ref}
      role="alert"
      data-store-alert
      data-testid={testId}
      {...otherProps}
    >
      {icon && <Icon component={icon} />}

      {children}

      {dismissible && (
        <Button
          type="button"
          data-dismiss="alert"
          aria-label="Close"
          onClick={handleClose}
        >
          <span>&times;</span>
        </Button>
      )}
    </div>
  )
})

export default Alert
