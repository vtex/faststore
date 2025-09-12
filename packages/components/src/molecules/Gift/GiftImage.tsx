import type { ComponentProps } from 'react'
import React from 'react'

export interface GiftImageProps extends ComponentProps<'div'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
}

export default function GiftImage({
  testId = 'fs-gift-image',
  children,
  ref,
  ...otherProps
}: GiftImageProps) {
  return (
    <div ref={ref} data-fs-gift-image data-testid={testId} {...otherProps}>
      {children}
    </div>
  )
}
