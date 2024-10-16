import React, { cloneElement, forwardRef, ReactNode } from 'react'
import Button, { ButtonProps, IconPosition } from '../../atoms/Button'
import { useDropdownTrigger } from './hooks/useDropdownTrigger'

export interface DropdownButtonProps
  extends Omit<ButtonProps, 'variant' | 'inverse' | 'icon' | 'iconPosition' > {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Replace the default rendered element with the provided child element, merging their props and behavior.
   */
  asChild?: boolean
  /**
   * Boolean that represents a loading state.
   */
  loading?: boolean
  /**
   * Specifies a label for loading state.
   */
  loadingLabel?: string
  /**
   * @deprecated
   * A React component that will be rendered as an icon.
   */
  icon?: ReactNode
  /**
   * @deprecated
   * Specifies where the icon should be positioned
   */
  iconPosition?: IconPosition
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
