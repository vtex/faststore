import { DropdownButton as UIDropdownButton } from '@faststore/ui'
import type { DropdownButtonProps } from '@faststore/ui'

function DropdownButton({
  children,
  testId = 'store-dropdown-button',
  ...otherProps
}: DropdownButtonProps) {
  return (
    <UIDropdownButton
      data-fs-dropdown-button
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </UIDropdownButton>
  )
}

export default DropdownButton
