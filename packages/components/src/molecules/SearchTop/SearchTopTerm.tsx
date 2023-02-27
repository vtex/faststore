import React from 'react'
import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

import { Badge, Link, LinkProps, LinkElementType } from '../../'

export interface SearchTopTermProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Defines the text displayed in top term item.
   */
  value: string
  /**
   * Props for the link from term component.
   */
  linkProps?: Partial<LinkProps<LinkElementType>>
  /**
   * Defines term's order number.
   */
  index: number
}

const SearchTopTerm = forwardRef<HTMLDivElement, SearchTopTermProps>(
  function SearchTopTerm({
    testId = 'fs-top-search-term',
    value,
    linkProps,
    index,
  }) {
    return (
      <li data-fs-search-top-item data-testid={testId}>
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
