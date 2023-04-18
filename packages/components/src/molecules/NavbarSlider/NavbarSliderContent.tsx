import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface NavbarSliderContentProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const NavbarSliderContent = forwardRef<
  HTMLDivElement,
  NavbarSliderContentProps
>(function NavbarSliderContent(
  { children, testId = 'fs-navbar-slider-content', ...otherProps },
  ref
) {
  return (
    <div
      data-fs-navbar-slider-content
      ref={ref}
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </div>
  )
})

export default NavbarSliderContent
