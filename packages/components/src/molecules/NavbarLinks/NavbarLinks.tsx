import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface NavbarLinksProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const NavbarLinks = forwardRef<HTMLDivElement, NavbarLinksProps>(
  function NavbarLinks(
    { children, testId = 'fs-navbar-links', ...otherProps },
    ref
  ) {
    return (
      <nav data-fs-navbar-links ref={ref} data-testid={testId} {...otherProps}>
        <div data-fs-navbar-links-wrapper>{children}</div>
      </nav>
    )
  }
)

export default NavbarLinks
