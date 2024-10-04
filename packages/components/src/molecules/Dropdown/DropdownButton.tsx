import React, { cloneElement, forwardRef } from 'react'
import Button, { ButtonProps } from '../../atoms/Button'
import { useDropdownTrigger } from './hooks/useDropdownTrigger'

export interface DropdownButtonProps
  extends Omit<ButtonProps, 'variant' | 'inverse'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /** Replace the default rendered element with the one passed as a child, merging their props and behavior. */
  asChild?: boolean
}

const DropdownButton = forwardRef<HTMLButtonElement, DropdownButtonProps>(
  function DropdownButton(
    { testId = 'fs-dropdown-button', children, asChild = false, ...otherProps },
    triggerRef
  ) {
    const triggerProps = useDropdownTrigger({ triggerRef })

    const asChildrenTrigger = React.isValidElement(children)
    ? cloneElement(children, { ...triggerProps, ...children.props })
    : children;

    return (
      <>
        {asChild ? (
          asChildrenTrigger
        ) : (
          <Button
            data-fs-dropdown-button
            data-testid={testId}
            variant="tertiary"
            {...triggerProps}
            {...otherProps}
          >
            {children}
          </Button>
        )}
      </>
    )
  }
)

export default DropdownButton
