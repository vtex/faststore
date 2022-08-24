import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface GiftProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

const Gift = forwardRef<HTMLDivElement, GiftProps>(function Gift(
  { testId = 'store-gift', children, ...otherProps },
  ref
) {
  return (
    <div ref={ref} data-fs-gift data-testid={testId} {...otherProps}>
      {children}
    </div>
  )
})

export default Gift
