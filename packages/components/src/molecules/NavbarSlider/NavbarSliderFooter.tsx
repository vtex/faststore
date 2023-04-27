import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface NavbarSliderFooterProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const NavbarSliderFooter = forwardRef<HTMLDivElement, NavbarSliderFooterProps>(
  function NavbarSliderFooter(
    { children, testId = 'fs-navbar-slider-footer', ...otherProps },
    ref
  ) {
    return (
      <footer
        data-fs-navbar-slider-footer
        ref={ref}
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </footer>
    )
  }
)

export default NavbarSliderFooter
