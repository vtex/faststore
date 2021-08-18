import type { ReactNode } from 'react'
import React, { forwardRef } from 'react'

import Button from '../../atoms/Button'
import type { ButtonProps } from '../../atoms/Button'
import Icon from '../../atoms/Icon'

export interface Props extends ButtonProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * The icon component
   */
  icon: ReactNode
  children?: never
}

const IconButton = forwardRef<HTMLButtonElement, Props>(function IconButton(
  { icon, testId = 'store-icon-button', ...buttonProps },
  ref
) {
  return (
    <Button ref={ref} data-store-icon-button testId={testId} {...buttonProps}>
      <Icon component={icon} />
    </Button>
  )
})

export default IconButton
