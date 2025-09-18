import type { ComponentProps } from 'react'
import React from 'react'

export interface CartItemImageProps extends ComponentProps<'div'> {
  /**
   * ID to find this component in testing tools (e.g.: Testing Library, and Jest).
   */
  testId?: string
}

export default function CartItemImage({
  testId = 'fs-cart-item-image',
  children,
  ref,
  ...otherProps
}: CartItemImageProps) {
  return (
    <div ref={ref} data-fs-cart-item-image data-testid={testId} {...otherProps}>
      {children}
    </div>
  )
}
