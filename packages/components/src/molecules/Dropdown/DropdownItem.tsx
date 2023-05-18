import type { ButtonHTMLAttributes, ReactNode } from 'react'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import { useDropdown } from './hooks/useDropdown'

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
    const { dropdownItemsRef, selectedDropdownItemIndexRef, close } =
      useDropdown()

    const [dropdownItemIndex, setDropdownItemIndex] = useState(0)
    const dropdownItemRef = useRef<HTMLButtonElement>()

    const addToRefs = (el: HTMLButtonElement) => {
      if (el && !dropdownItemsRef?.current.includes(el)) {
        dropdownItemsRef?.current.push(el)
        setDropdownItemIndex(
          dropdownItemsRef?.current.findIndex((element) => element === el) ?? 0
        )
      }

      dropdownItemRef.current = el
    }

    const onFocusItem = () => {
      selectedDropdownItemIndexRef!.current = dropdownItemIndex
      dropdownItemsRef?.current[selectedDropdownItemIndexRef!.current]?.focus()
    }

    const handleOnClickItem = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      onClick?.(event)
      close?.()
    }

    useImperativeHandle(ref, () => dropdownItemRef.current!, [])

    return (
      <button
        data-fs-dropdown-item
        data-testid={testId}
        ref={addToRefs}
        onFocus={onFocusItem}
        onMouseEnter={onFocusItem}
        onClick={handleOnClickItem}
        role="menuitem"
        tabIndex={-1}
        data-index={dropdownItemIndex}
        {...otherProps}
      >
        {!!icon && icon}
        {children}
      </button>
    )
  }
)

export default DropdownItem
