import type { HTMLAttributes, ReactNode } from 'react'
import React, { forwardRef } from 'react'

import { Icon } from '../..'

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
}

const Gift = forwardRef<HTMLDivElement, GiftProps>(function Gift(
  { icon, testId = 'fs-gift', children, ...otherProps },
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
