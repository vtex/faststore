import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface NavbarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const Navbar = forwardRef<HTMLDivElement, NavbarProps>(function Navbar(
  { testId = 'fs-navbar', children, ...otherProps },
  ref
) {
  return (
    <header data-fs-navbar ref={ref} data-testid={testId} {...otherProps}>
      {children}
    </header>
  )
})

export default Navbar
