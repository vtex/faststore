import type { ReactNode } from 'react'
import React, { HTMLAttributes } from 'react'
import { Icon, MagnifyingGlass, Link, LinkProps, LinkElementType } from '../..'

export interface SearchAutoCompleteTermProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Defines the text displayed in history term item.
   */
  value: string | ReactNode
  /**
   * Props for the link from term component.
   */
  linkProps?: Partial<LinkProps<LinkElementType>>
  /**
   * A React component that will be rendered as an icon.
   */
  icon?: ReactNode
}

const SearchAutoCompleteTerm = ({
  testId = 'fs-search-auto-complete-term',
  value,
  linkProps,
  icon,
}: SearchAutoCompleteTermProps) => {
  const autoCompleteIcon = icon ? icon : <MagnifyingGlass />

  return (
    <li data-fs-search-auto-complete-item data-testid={testId}>
      <Link
        {...linkProps}
        data-fs-search-auto-complete-item-link
        variant="display"
      >
        {autoCompleteIcon && (
          <Icon
            component={autoCompleteIcon}
            data-fs-search-auto-complete-item-icon
          />
        )}
        <span>{value}</span>
      </Link>
    </li>
  )
}

export default SearchAutoCompleteTerm
