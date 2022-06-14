import { DropdownMenu as UIDropdownMenu } from '@faststore/ui'
import type { DropdownMenuProps } from '@faststore/ui'

import styles from './dropdown.module.scss'

export type Size = 'small' | 'regular'

export type Props = DropdownMenuProps & {
  /**
   * Specifies the size variant
   */
  size?: Size
}

function DropdownMenu({
  children,
  size = 'regular',
  testId = 'store-dropdown-menu',
  ...otherProps
}: Props) {
  return (
    <UIDropdownMenu
      data-fs-dropdown-menu
      data-fs-dropdown-menu-size={size}
      className={styles.fsDropdownMenu}
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </UIDropdownMenu>
  )
}

export default DropdownMenu
