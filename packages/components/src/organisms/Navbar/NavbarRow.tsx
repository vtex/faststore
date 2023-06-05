import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface NavbarRowProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const NavbarRow = forwardRef<HTMLDivElement, NavbarRowProps>(function NavbarRow(
  { children, testId = 'fs-navbar-row', ...otherProps },
  ref
) {
  return (
    <div
      data-fs-navbar-row
      data-fs-content="navbar"
      ref={ref}
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </div>
  )
})

export default NavbarRow
