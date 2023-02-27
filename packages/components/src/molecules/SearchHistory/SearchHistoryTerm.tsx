import type { ReactNode } from 'react'
import React, { HTMLAttributes } from 'react'
import { Icon, ClockClockwise, Link, LinkProps, LinkElementType } from '../..'

export interface SearchHistoryTermProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Defines the text displayed in history term item.
   */
  value: string
  /**
   * Defines the url for history item.
   */
  href: string
  /**
   * Event handler for clicks on each item.
   */
  onClick?: () => void
  /**
   * Props for the link from term component.
   */
  linkProps?: Partial<LinkProps<LinkElementType>>
  /**
   * A React component that will be rendered as an icon.
   */
  icon?: ReactNode
}

const SearchHistoryTerm = ({
  testId = 'fs-search-history-term',
  value,
  href,
  onClick,
  linkProps,
  icon,
}: SearchHistoryTermProps) => {
  const historyIcon = icon ? icon : <ClockClockwise />

  return (
    <li data-fs-search-history-item data-testid={testId}>
      <Link
        {...linkProps}
        data-fs-search-history-item-link
        variant="display"
        href={href}
        onClick={onClick}
      >
        {historyIcon && (
          <Icon component={historyIcon} data-fs-search-history-item-icon />
        )}
        <span>{value}</span>
      </Link>
    </li>
  )
}

export default SearchHistoryTerm
