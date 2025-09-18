import React from 'react'
import type { ComponentProps } from 'react'

export interface NavbarButtonsProps extends ComponentProps<'div'> {
  /**
   * ID to find this component in testing tools (e.g.: Testing Library, and Jest).
   */
  testId?: string
  /**
   * Specifies whether the Search Input is expanded or not.
   */
  searchExpanded: boolean
}

export default function NavbarButtons({
  children,
  searchExpanded,
  testId = 'fs-navbar-buttons',
  ref,
  ...otherProps
}: NavbarButtonsProps) {
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
