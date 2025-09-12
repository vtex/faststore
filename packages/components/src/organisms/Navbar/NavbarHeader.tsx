import React from 'react'
import type { ComponentProps } from 'react'

export interface NavbarHeaderProps extends ComponentProps<'div'> {
  /**
   * ID to find this component in testing tools (e.g.: Testing Library, and Jest).
   */
  testId?: string
}

export default function NavbarHeader({
  children,
  testId = 'fs-navbar-header',
  ref,
  ...otherProps
}: NavbarHeaderProps) {
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
