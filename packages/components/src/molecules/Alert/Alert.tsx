import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

import { Icon, Link, LinkProps } from '../../'

import type { MouseEvent, ReactNode } from 'react'
import AlertCloseButton from './AlertCloseButton'

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
   * Extends all Link Props.
   */
  link?: LinkProps
  /**
   * Function called when dismiss button is clicked.
   */
  onClose?: (event: MouseEvent<HTMLElement>) => void
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    testId = 'fs-alert',
    children,
    icon,
    dismissible,
    link,
    onClose,
    ...otherProps
  },
  ref
) {
  return (
    <div
      ref={ref}
      role="alert"
      data-fs-alert
      data-fs-alert-dismissible={dismissible}
      data-fs-content="alert"
      data-testid={testId}
      {...otherProps}
    >
      {!!icon && icon}

      <p data-fs-alert-content>{children}</p>

      {link && <Link data-fs-alert-link variant="inline" {...link} />}

      {dismissible && (
        <AlertCloseButton
          size="small"
          aria-label="Close"
          icon={<Icon name="X" />}
          onClick={onClose}
        />
      )}
    </div>
  )
})

export default Alert
