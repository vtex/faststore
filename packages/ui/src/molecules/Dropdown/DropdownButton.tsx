import type { ButtonHTMLAttributes } from 'react'
import React, { forwardRef, useImperativeHandle } from 'react'

import { useDropdown } from './hooks/useDropdown'

export interface DropdownButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const DropdownButton = forwardRef<HTMLButtonElement, DropdownButtonProps>(
  function Button(
    { children, testId = 'store-dropdown-button', ...otherProps },
    ref
  ) {
    const { toggle, dropdownButtonRef, isOpen, id } = useDropdown()

    useImperativeHandle(ref, () => dropdownButtonRef!.current!, [
      dropdownButtonRef,
    ])

    return (
      <button
        data-store-dropdown-button
        onClick={toggle}
        data-testid={testId}
        ref={dropdownButtonRef}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={id}
        {...otherProps}
      >
        {children}
      </button>
    )
  }
)

export default DropdownButton
