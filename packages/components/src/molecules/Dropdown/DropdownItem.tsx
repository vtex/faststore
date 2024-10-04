import type { ButtonHTMLAttributes, ReactNode } from 'react'
import React, { cloneElement, forwardRef } from 'react'

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
  /** 
   * Replace the default rendered element with the one passed as a child, merging their props and behavior. 
   * */
  asChild?: boolean
  /**
   *  Emit onDismiss eventwhen the component is clicked.
   */
  dismissOnClick?: boolean
}

const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  function Button(
    { children, asChild, icon, onClick, dismissOnClick = true, testId = 'fs-dropdown-item', ...otherProps },
    ref
  ) {
    const itemProps = useDropdownItem({ ref, onClick, dismissOnClick })

    const asChildrenItem = React.isValidElement(children)
    ? cloneElement(children, { ...itemProps, ...children.props })
    : children;

    return (
      <>
      {asChild ? (
        asChildrenItem
      ) : (
        <button
          data-fs-dropdown-item
          data-testid={testId}
          {...itemProps}
          {...otherProps}
        >
          {!!icon && icon}
          {children}
        </button>
        )}
      </>
    )
  }
)

export default DropdownItem
