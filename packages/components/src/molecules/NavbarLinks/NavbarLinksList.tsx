import React, { forwardRef } from 'react'

import { List } from '../..'
import type { ListProps } from '../..'

export interface NavbarLinksListProps extends ListProps {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const NavbarLinksList = forwardRef<HTMLUListElement, NavbarLinksListProps>(
  function NavbarLinksList(
    { children, testId = 'fs-navbar-links-list', ...otherProps },
    ref
  ) {
    return (
      <List
        data-fs-navbar-links-list
        ref={ref}
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </List>
    )
  }
)

export default NavbarLinksList
