import { List } from '../..'
import type { ListProps } from '../..'

export interface NavbarLinksListProps extends ListProps {
  /**
   * ID to find this component in testing tools (e.g.: Testing Library, and Jest).
   */
  testId?: string
}

export default function NavbarLinksList({
  children,
  testId = 'fs-navbar-links-list',
  ref,
  ...otherProps
}: NavbarLinksListProps) {
  return (
    <List
      data-fs-navbar-links-list
      ref={ref}
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </List>
  )
}
