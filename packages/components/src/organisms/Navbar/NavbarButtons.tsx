import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface NavbarButtonsProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const NavbarButtons = forwardRef<HTMLDivElement, NavbarButtonsProps>(
  function NavbarButtons(
    { testId = 'fs-navbar-buttons', children, ...otherProps },
    ref
  ) {
    return (
      <div ref={ref} data-fs-navbar-buttons {...otherProps}>
        {children}
      </div>
    )
  }
)

export default NavbarButtons
