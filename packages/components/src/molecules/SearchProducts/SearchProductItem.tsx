import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

import { Link, type LinkElementType, type LinkProps } from '../..'

export interface SearchProductItemProps extends HTMLAttributes<HTMLLIElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Props for the link from SearchProduct component.
   */
  linkProps?: Partial<LinkProps<LinkElementType>>
}

const SearchProductItem = forwardRef<HTMLLIElement, SearchProductItemProps>(
  function ProductItem(
    { testId = 'fs-search-product-item', linkProps, children, ...otherProps },
    ref
  ) {
    return (
      <li
        ref={ref}
        data-fs-search-product-item
        data-testid={testId}
        {...otherProps}
      >
        <Link {...linkProps} data-fs-search-product-item-link variant="display">
          {children}
        </Link>
      </li>
    )
  }
)

export default SearchProductItem
