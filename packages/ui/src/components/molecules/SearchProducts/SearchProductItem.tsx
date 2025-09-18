import type { ComponentProps } from 'react'
import React from 'react'

import { Link, type LinkElementType, type LinkProps } from '../..'

export interface SearchProductItemProps extends ComponentProps<'li'> {
  /**
   * ID to find this component in testing tools (e.g.: testing-library, and jest).
   */
  testId?: string
  /**
   * Props for the link from SearchProduct component.
   */
  linkProps?: Partial<LinkProps<LinkElementType>>
}

export default function SearchProductItem({
  testId = 'fs-search-product-item',
  linkProps,
  children,
  ref,
}: SearchProductItemProps) {
  return (
    <li ref={ref} data-fs-search-product-item data-testid={testId}>
      <Link {...linkProps} data-fs-search-product-item-link variant="display">
        {children}
      </Link>
    </li>
  )
}
