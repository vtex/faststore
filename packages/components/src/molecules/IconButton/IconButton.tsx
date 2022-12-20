import type { ReactNode, AriaAttributes } from 'react'
import React, { forwardRef } from 'react'

import { Icon, Button } from '../../index'
import type { ButtonProps } from '../../index'

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
        aria-label={ariaLabel}
        testId={testId}
        {...otherProps}
      >
        {children}
        <Icon component={icon} />
      </Button>
    )
  }
)

export default IconButton
