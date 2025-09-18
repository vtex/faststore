import type { ComponentProps } from 'react'
import React from 'react'

export interface ProductShelfProps extends ComponentProps<'div'> {
  /**
   * ID to find this component in testing tools (e.g.: Testing Library, and Jest).
   */
  testId?: string
}

export default function ProductShelf({
  testId = 'fs-product-shelf',
  children,
  ref,
  ...otherProps
}: ProductShelfProps) {
  return (
    <div
      ref={ref}
      data-fs-product-shelf
      data-fs-content="product-shelf"
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </div>
  )
}
