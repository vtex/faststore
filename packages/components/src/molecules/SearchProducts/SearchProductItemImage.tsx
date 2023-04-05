import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface SearchProductItemImageProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const SearchProductItemImage = forwardRef<
  HTMLDivElement,
  SearchProductItemImageProps
>(function SearchProductItemImage(
  { testId = 'fs-search-product-item-image', children, ...otherProps },
  ref
) {
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
})

export default SearchProductItemImage
