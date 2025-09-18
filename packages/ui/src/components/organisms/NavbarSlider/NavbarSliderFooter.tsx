import React from 'react'
import type { ComponentProps } from 'react'

export interface NavbarSliderFooterProps extends ComponentProps<'div'> {
  /**
   * ID to find this component in testing tools (e.g.: Testing Library, and Jest).
   */
  testId?: string
}

export default function NavbarSliderFooter({
  children,
  testId = 'fs-navbar-slider-footer',
  ref,
  ...otherProps
}: NavbarSliderFooterProps) {
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
