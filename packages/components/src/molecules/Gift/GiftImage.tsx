import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface GiftImageProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const GiftImage = forwardRef<HTMLDivElement, GiftImageProps>(function GiftImage(
  { testId = 'fs-gift-image', children, ...otherProps },
  ref
) {
  return (
    <div ref={ref} data-fs-gift-image data-testid={testId} {...otherProps}>
      {children}
    </div>
  )
})

export default GiftImage
