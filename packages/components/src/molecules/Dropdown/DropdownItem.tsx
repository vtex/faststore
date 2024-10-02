import type { ButtonHTMLAttributes, ReactNode } from 'react'
import React, { forwardRef } from 'react'

import { useDropdownItem } from './hooks/useDropdownItem'

export interface DropdownItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * A React component that will be rendered as an icon.
   */
  icon?: ReactNode
}

const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  function Button(
    { children, icon, onClick, testId = 'fs-dropdown-item', ...otherProps },
    ref
  ) {
    const itemProps = useDropdownItem({ ref, onClick })

    return (
      <button
        data-fs-dropdown-item
        data-testid={testId}
        {...itemProps}
        {...otherProps}
      >
        {!!icon && icon}
        {children}
      </button>
    )
  }
)

export default DropdownItem
