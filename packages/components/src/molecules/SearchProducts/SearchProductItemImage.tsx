import type { ComponentProps } from 'react'
import React from 'react'

export interface SearchProductItemImageProps extends ComponentProps<'div'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
}

export default function SearchProductItemImage({
  testId = 'fs-search-product-item-image',
  children,
  ref,
  ...otherProps
}: SearchProductItemImageProps) {
  return (
    <div
      ref={ref}
      data-fs-search-product-item-image
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </div>
  )
}
