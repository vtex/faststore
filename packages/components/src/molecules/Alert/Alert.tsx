import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'
import { useCallback } from 'react'

import { Button, Link, Icon } from '../../index'

import { X } from '../../assets'

import type { ReactNode, MouseEvent } from 'react'

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Icon component for additional customization.
   */
  icon?: ReactNode
  /**
   * Enables dismissible feature.
   */
  dismissible?: boolean
  /**
   * The href and label used at the link.
   */
  link?: {
    to: string
    text: string
  }
  /**
   * Function called when dismiss button is clicked.
   */
  onClose?: (event: MouseEvent<HTMLElement>) => void
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert({
  testId = 'fs-alert',
  children,
  icon,
  dismissible,
  link,
  onClose,
  ...otherProps
},
  ref) {
  const handleClose = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (event.defaultPrevented) {
        return
      }

      onClose?.(event)
    },
    [onClose]
  )
  return (
    <div
      ref={ref}
      role="alert"
      data-fs-alert
      data-testid={testId}
      data-fs-alert-dismissible={dismissible}
      {...otherProps}
    >

      {icon && <Icon component={icon} />}

      <p data-fs-alert-content>{children}</p>

      {link && (
        <Link data-fs-alert-link variant="inline" href={link.to}>
          {link.text}
        </Link>
      )}

      {dismissible && (
        <Button data-fs-alert-button aria-label="Close" onClick={handleClose}>
          <span>
            <Icon component={<X />} />
          </span>
        </Button>
      )}
    </div>
  )
})

export default Alert
