import React from 'react'
import type { ComponentProps } from 'react'

export interface NavbarRowProps extends ComponentProps<'div'> {
  /**
   * ID to find this component in testing tools (e.g.: Testing Library, and Jest).
   */
  testId?: string
}

export default function NavbarRow({
  children,
  testId = 'fs-navbar-row',
  ref,
  ...otherProps
}: NavbarRowProps) {
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
}
