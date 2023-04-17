import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface NavbarRowProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const NavbarRow = forwardRef<HTMLDivElement, NavbarRowProps>(function NavbarRow(
  { testId = 'fs-navbar-row', children, ...otherProps },
  ref
) {
  return (
    <div ref={ref} data-fs-navbar-row {...otherProps}>
      {children}
    </div>
  )
})

export default NavbarRow
