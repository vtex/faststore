import type { ReactNode, AriaAttributes } from 'react'
import React, { forwardRef } from 'react'

import { Button } from '../../'
import type { ButtonProps } from '../../'

export interface IconButtonProps extends Omit<ButtonProps, 'aria-label'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * A React component that will be rendered as an icon.
   */
  icon: ReactNode
  /**
   * A Label should be provided.
   */
  'aria-label': AriaAttributes['aria-label']
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      icon,
      children,
      testId = 'fs-icon-button',
      'aria-label': ariaLabel,
      size = 'regular',
      variant,
      ...otherProps
    },
    ref
  ) {
    return (
      <Button
        ref={ref}
        data-fs-button
        data-fs-icon-button
        variant={variant ?? 'tertiary'}
        icon={icon}
        aria-label={ariaLabel}
        testId={testId}
        size={size}
        {...otherProps}
      >
        {children}
      </Button>
    )
  }
)

export default IconButton
