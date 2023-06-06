import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface NavbarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
  /**
   * Specifies the scroll direction. This value can be achieved using the `useScrollDirection` hook.
   */
  scrollDirection: string
}

const Navbar = forwardRef<HTMLDivElement, NavbarProps>(function Navbar(
  { children, scrollDirection, testId = 'fs-navbar', ...otherProps },
  ref
) {
  return (
    <header
      data-fs-navbar
      role="banner"
      data-fs-navbar-scroll={scrollDirection}
      ref={ref}
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </header>
  )
})

export default Navbar
