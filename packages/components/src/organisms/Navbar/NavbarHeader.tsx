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
    { testId = 'fs-navbar-header', children, ...otherProps },
    ref
  ) {
    return (
      <section ref={ref} data-fs-navbar-header {...otherProps}>
        {children}
      </section>
    )
  }
)

export default NavbarHeader
