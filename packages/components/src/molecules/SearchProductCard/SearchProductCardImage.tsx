import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface SearchProductCardImageProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const SearchProductCardImage = forwardRef<
  HTMLDivElement,
  SearchProductCardImageProps
>(function SearchProductCardImage(
  { testId = 'fs-search-product-card-image', children, ...otherProps },
  ref
) {
  return (
    <div
      ref={ref}
      data-fs-search-product-card-image
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </div>
  )
})

export default SearchProductCardImage
