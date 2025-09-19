import type { ComponentProps } from 'react'

export interface NavbarSliderContentProps extends ComponentProps<'div'> {
  /**
   * ID to find this component in testing tools (e.g.: Testing Library, and Jest).
   */
  testId?: string
}

export default function NavbarSliderContent({
  children,
  testId = 'fs-navbar-slider-content',
  ref,
  ...otherProps
}: NavbarSliderContentProps) {
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
}
