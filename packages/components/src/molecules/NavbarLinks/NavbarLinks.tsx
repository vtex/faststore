import type { ComponentProps } from 'react'

export interface NavbarLinksProps extends ComponentProps<'nav'> {
  /**
   * ID to find this component in testing tools (e.g.: Testing Library, and Jest).
   */
  testId?: string
}

export default function NavbarLinks({
  children,
  testId = 'fs-navbar-links',
  ref,
  ...otherProps
}: NavbarLinksProps) {
  return (
    <nav data-fs-navbar-links ref={ref} data-testid={testId} {...otherProps}>
      {children}
    </nav>
  )
}
