import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

import { Badge, Link, LinkElementType, LinkProps } from '../../'

export interface SearchTopTermProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Search term to be shown.
   */
  value: string
  /**
   * Props for the `<Link>` rendered by this component.
   */
  linkProps?: Partial<LinkProps<LinkElementType>>
  /**
   * Current term's position in a list of search terms.
   */
  index: number
}

const SearchTopTerm = forwardRef<HTMLLIElement, SearchTopTermProps>(
  function SearchTopTerm(
    { testId = 'fs-top-search-term', value, linkProps, index },
    ref
  ) {
    return (
      <li ref={ref} data-fs-search-top-item data-testid={testId}>
        <Link {...linkProps} data-fs-search-top-item-link variant="display">
          <Badge data-fs-search-top-item-badge variant="info">
            {index + 1}
          </Badge>
          {value}
        </Link>
      </li>
    )
  }
)

export default SearchTopTerm
