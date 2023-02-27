import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

import { Link, LinkProps, LinkElementType } from '../../'

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
  /**
   * Callback function when SearchProduct link is clicked.
   */
  onLinkClick?: () => void
}

const SearchProductCard = forwardRef<HTMLDivElement, SearchProductCardProps>(
  function ProductCard(
    {
      testId = 'fs-search-product-card',
      linkProps,
      onLinkClick,
      children,
      ...otherProps
    },
    ref
  ) {
    return (
      <article
        ref={ref}
        data-fs-search-product-card
        data-testid={testId}
        {...otherProps}
      >
        <Link
          {...linkProps}
          data-fs-search-product-card-link
          title={name}
          variant="display"
          onClick={onLinkClick}
        >
          {children}
        </Link>
      </article>
    )
  }
)

export default SearchProductCard
