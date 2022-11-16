import type { ReactNode } from 'react'
import React, { forwardRef } from 'react'

import { Icon, Button } from '../../index'
import type { ButtonProps } from '../../index'

export type IconPosition = 'left' | 'right'

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
   * Label to be required for accessibility.
   */
  'aria-label': string
  /**
   * Specifies where the icon should be positioned
   */
  iconPosition?: IconPosition
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      icon,
      testId = 'fs-icon-button',
      iconPosition = 'left',
      children,
      'aria-label': ariaLabel,
      ...otherProps
    },
    ref
  ) {
    const isButtonIcon = icon && !children
    return (
      <Button
        ref={ref}
        data-fs-button
        data-fs-icon-button
        data-fs-button-icon={isButtonIcon}
        testId={testId}
        {...otherProps}
      >
        {iconPosition === 'left' && <Icon component={icon} />}
        {children}
        {iconPosition === 'right' && <Icon component={icon} />}
      </Button>
    )
  }
)

export default IconButton
