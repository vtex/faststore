import React, { forwardRef, useImperativeHandle, AriaAttributes } from 'react'
import Button, { ButtonProps } from '../../atoms/Button'

import { useDropdown } from './hooks/useDropdown'

export interface DropdownButtonProps
  extends Omit<ButtonProps, 'variant' | 'inverse'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * For accessibility purposes, add an ARIA label to the element when it doesn't have a label.
   */
  'aria-label'?: AriaAttributes['aria-label']
}

const DropdownButton = forwardRef<HTMLButtonElement, DropdownButtonProps>(
  function DropdownButton(
    {
      testId = 'fs-dropdown-button',
      'aria-label': ariaLabel,
       children,
      ...otherProps
    },
    ref
  ) {
    const { toggle, dropdownButtonRef, isOpen, id } = useDropdown()

    useImperativeHandle(ref, () => dropdownButtonRef!.current!, [
      dropdownButtonRef,
    ])

    return (
      <Button
        data-fs-dropdown-button
        onClick={toggle}
        data-testid={testId}
        ref={dropdownButtonRef}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={id}
        variant="tertiary"
        {...otherProps}
      >
        {children}
      </Button>
    )
  }
)

export default DropdownButton
