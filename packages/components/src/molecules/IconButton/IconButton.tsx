import type { ReactNode } from 'react'
import React, { forwardRef } from 'react'

import { Icon, Button } from '../../index'
import type { ButtonProps } from '../../index'

export type IconPosition = 'left' | 'right'

export interface IconButtonProps
  extends Omit<ButtonProps, 'children' | 'aria-label'> {
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
      ...buttonProps
    },
    ref
  ) {
    return (
      <Button ref={ref} data-fs-icon-button testId={testId} {...buttonProps}>
        {iconPosition === 'left' && <Icon component={icon} />}
        {children}
        {iconPosition === 'right' && <Icon component={icon} />}
      </Button>
    )
  }
)

export default IconButton
