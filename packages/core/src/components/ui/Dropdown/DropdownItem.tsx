import type { DropdownItemProps } from '@faststore/ui'
import { DropdownItem as UIDropdownItem, Icon as UIIcon } from '@faststore/ui'
import type { ReactNode } from 'react'

export type Props = DropdownItemProps & {
  /**
   * Icon component for additional customization
   */
  icon?: ReactNode
}

function DropdownItem({
  children,
  icon,
  testId = 'store-dropdown-item',
  ...otherProps
}: Props) {
  return (
    <UIDropdownItem data-fs-dropdown-item data-testid={testId} {...otherProps}>
      {icon && <UIIcon component={icon} data-fs-dropdown-item-icon />}
      {children}
    </UIDropdownItem>
  )
}

export default DropdownItem
