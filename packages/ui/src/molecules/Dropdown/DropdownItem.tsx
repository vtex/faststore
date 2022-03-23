import type { ButtonHTMLAttributes } from 'react'
import React, { useImperativeHandle, forwardRef, useRef, useState } from 'react'

import { useDropdown } from './hooks/useDropdown'

export interface DropdownItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  function Button(
    { children, onClick, testId = 'store-dropdown-item', ...otherProps },
    ref
  ) {
    const {
      dropdownItemsRef,
      selectedDropdownItemIndexRef,
      close,
    } = useDropdown()

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
        data-store-dropdown-item
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
        {children}
      </button>
    )
  }
)

export default DropdownItem
