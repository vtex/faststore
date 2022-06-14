import { Dropdown as UIDropdown } from '@faststore/ui'
import type { DropdownProps } from '@faststore/ui'

const Dropdown = ({ children, ...otherProps }: DropdownProps) => {
  return (
    <UIDropdown data-fs-dropdown {...otherProps}>
      {children}
    </UIDropdown>
  )
}

export default Dropdown
