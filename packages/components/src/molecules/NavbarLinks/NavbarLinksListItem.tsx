import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface NavbarLinksListItemProps
  extends HTMLAttributes<HTMLLIElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const NavbarLinksListItem = forwardRef<HTMLLIElement, NavbarLinksListItemProps>(
  function NavbarLinksListItem(
    { children, testId = 'fs-navbar-links-list-item', ...otherProps },
    ref
  ) {
    return (
      <li
        data-fs-navbar-links-list-item
        ref={ref}
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </li>
    )
  }
)

export default NavbarLinksListItem
