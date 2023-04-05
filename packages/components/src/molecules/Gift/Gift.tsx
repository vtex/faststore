import type { HTMLAttributes, ReactNode } from 'react'
import React, { forwardRef } from 'react'


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
  const iconProps = { "data-fs-gift-icon": true }
  const giftIcon = React.isValidElement(icon) ? React.cloneElement(icon, iconProps) : icon
  return (
    <div ref={ref} data-fs-gift data-testid={testId} {...otherProps}>
      {React.isValidElement(giftIcon) && giftIcon}
      <div data-fs-gift-wrapper>{children}</div>
    </div>
  )
})

export default Gift
