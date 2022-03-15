import type { ButtonHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface DropdownItemProps<T = HTMLButtonElement>
  extends ButtonHTMLAttributes<T> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  function Button(
    { children, testId = 'store-dropdown-item', ...otherProps },
    ref
  ) {
    return (
      <button
        ref={ref}
        data-store-dropdown-item
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </button>
    )
  }
)

export default DropdownItem
