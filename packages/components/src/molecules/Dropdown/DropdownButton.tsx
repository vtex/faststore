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
    { children, testId = 'fs-dropdown-button', ...otherProps },
    ref
  ) {
    const { toggle, dropdownButtonRef, isOpen, id } = useDropdown()

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    useImperativeHandle(ref, () => dropdownButtonRef!.current!, [
      dropdownButtonRef,
    ])

    return (
      <button
        data-fs-dropdown-button
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
