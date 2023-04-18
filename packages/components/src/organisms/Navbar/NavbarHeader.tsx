import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface NavbarHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const NavbarHeader = forwardRef<HTMLDivElement, NavbarHeaderProps>(
  function NavbarHeader(
    { children, testId = 'fs-navbar-header', ...otherProps },
    ref
  ) {
    return (
      <section
        data-fs-navbar-header
        ref={ref}
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </section>
    )
  }
)

export default NavbarHeader
