import React from 'react'
import type { ComponentProps } from 'react'

export interface ProductGridProps extends ComponentProps<'ul'> {
  /**
   * ID to find this component in testing tools (e.g.: Testing Library, and Jest).
   */
  testId?: string
}

export default function ProductGridItem({
  testId = 'fs-product-grid',
  children,
  ref,
  ...otherProps
}: ProductGridProps) {
  return (
    <ul ref={ref} data-fs-product-grid {...otherProps}>
      {children}
    </ul>
  )
}
