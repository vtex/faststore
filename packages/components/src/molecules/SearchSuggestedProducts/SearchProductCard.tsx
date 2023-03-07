import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

import { Link, LinkProps, LinkElementType } from '../..'

export interface SearchProductCardProps extends HTMLAttributes<HTMLDivElement> {
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

const SearchProductCard = forwardRef<HTMLDivElement, SearchProductCardProps>(
  function ProductCard({
    testId = 'fs-search-product-card',
    linkProps,
    children,
  }) {
    return (
      <li data-fs-search-product-card data-testid={testId}>
        <Link {...linkProps} data-fs-search-product-card-link variant="display">
          {children}
        </Link>
      </li>
    )
  }
)

export default SearchProductCard
