import type { ComponentProps } from 'react'
import React from 'react'

export interface NavbarProps extends ComponentProps<'header'> {
  /**
   * ID to find this component in testing tools (e.g.: Testing Library, and Jest).
   */
  testId?: string
  /**
   * Specifies the scroll direction. This value can be achieved using the `useScrollDirection` hook.
   */
  scrollDirection: string
}

export default function Navbar({
  children,
  scrollDirection,
  testId = 'fs-navbar',
  ref,
  ...otherProps
}: NavbarProps) {
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
}
