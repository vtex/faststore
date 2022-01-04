import type { ReactNode } from 'react'
import React, { forwardRef } from 'react'

import Button from '../../atoms/Button'
import type { ButtonProps } from '../../atoms/Button'
import Icon from '../../atoms/Icon'

export interface Props extends Omit<ButtonProps, 'children'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * A React component that will be rendered as an icon.
   */
  icon: ReactNode

  /**
   * Label to accessibility.
   */
  label: string
}

const IconButton = forwardRef<HTMLButtonElement, Props>(function IconButton(
  { icon, label, testId = 'store-icon-button', ...buttonProps },
  ref
) {
  return (
    <Button
      ref={ref}
      data-store-icon-button
      testId={testId}
      aria-label={label}
      {...buttonProps}
    >
      <Icon component={icon} />
    </Button>
  )
})

export default IconButton
