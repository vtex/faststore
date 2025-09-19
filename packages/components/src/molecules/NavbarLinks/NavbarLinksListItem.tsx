import type { ComponentProps } from 'react'

export interface NavbarLinksListItemProps extends ComponentProps<'li'> {
  /**
   * ID to find this component in testing tools (e.g.: Testing Library, and Jest).
   */
  testId?: string
}

export default function NavbarLinksListItem({
  children,
  testId = 'fs-navbar-links-list-item',
  ref,
  ...otherProps
}: NavbarLinksListItemProps) {
  return (
    <li
      data-fs-navbar-links-list-item
      ref={ref}
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </li>
  )
}
