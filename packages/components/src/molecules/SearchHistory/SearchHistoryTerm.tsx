import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Icon, Link, type LinkElementType, type LinkProps } from '../..'

export interface SearchHistoryTermProps
  extends ComponentPropsWithoutRef<'div'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
  /**
   * Defines the text displayed in history term item.
   */
  value: string
  /**
   * Props for the link from term component.
   */
  linkProps?: Partial<LinkProps<LinkElementType>>
  /**
   * A React component that will be rendered as an icon.
   */
  icon?: ReactNode
}

export default function SearchHistoryTerm({
  testId = 'fs-search-history-term',
  value,
  linkProps,
  icon = <Icon name="ClockClockwise" width={18} height={18} />,
}: SearchHistoryTermProps) {
  return (
    <li data-fs-search-history-item data-testid={testId}>
      <Link {...linkProps} data-fs-search-history-item-link variant="display">
        <span data-fs-search-history-item-icon>{icon}</span>
        <span>{value}</span>
      </Link>
    </li>
  )
}
