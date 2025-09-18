import type { ComponentProps } from 'react'
import React from 'react'

import { Badge, Link, type LinkElementType, type LinkProps } from '../../'

export interface SearchTopTermProps extends ComponentProps<'li'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
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

export default function SearchTopTerm({
  testId = 'fs-top-search-term',
  value,
  linkProps,
  index,
  ref,
}: SearchTopTermProps) {
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
