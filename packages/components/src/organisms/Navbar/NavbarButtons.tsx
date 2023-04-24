import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface NavbarButtonsProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
  /**
   * Specifies whether the Search Input is expanded or not.
   */
  searchExpanded: boolean
}

const NavbarButtons = forwardRef<HTMLDivElement, NavbarButtonsProps>(
  function NavbarButtons(
    { children, searchExpanded, testId = 'fs-navbar-buttons', ...otherProps },
    ref
  ) {
    return (
      <div
        data-fs-navbar-buttons
        ref={ref}
        data-testid={testId}
        data-fs-navbar-search-expanded={searchExpanded}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default NavbarButtons
