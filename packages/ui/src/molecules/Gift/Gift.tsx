import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import type { ReactNode } from 'react'

import Icon from '../../atoms/Icon'
export interface GiftProps extends HTMLAttributes<HTMLDivElement> {
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
   * Label to be required for accessibility.
   */
  'aria-label'?: string
}

const Gift = forwardRef<HTMLDivElement, GiftProps>(function Gift(
  { icon, testId = 'store-gift', children, ...otherProps },
  ref
) {
  return (
    <div ref={ref} data-fs-gift data-testid={testId} {...otherProps}>
      {icon && <Icon component={icon} data-fs-gift-icon />}
      <div data-fs-gift-wrapper>{children}</div>
    </div>
  )
})

export default Gift
