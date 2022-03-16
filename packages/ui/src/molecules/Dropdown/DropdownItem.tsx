import type { ButtonHTMLAttributes } from 'react'
import React, { useImperativeHandle, forwardRef, useRef } from 'react'

import { useDropdown } from './hooks/useDropdown'

export interface DropdownItemProps<T = HTMLButtonElement>
  extends ButtonHTMLAttributes<T> {
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
    const { dropdownItensRef, selectedDropdownItemRef, close } = useDropdown()
    const itemIndex = useRef(0)
    const dropdownItemRef = useRef<HTMLButtonElement>()

    const addToRefs = (el: HTMLButtonElement) => {
      if (el && !dropdownItensRef?.current.includes(el)) {
        dropdownItensRef?.current.push(el)
        itemIndex.current =
          dropdownItensRef?.current.findIndex((element) => element === el) ?? 0
      }

      dropdownItemRef.current = el
    }

    const onFocusItem = () => {
      selectedDropdownItemRef!.current = itemIndex.current
      dropdownItensRef?.current[selectedDropdownItemRef!.current]?.focus()
    }

    const handlerOnClickItem = (
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
        onClick={handlerOnClickItem}
        {...otherProps}
      >
        {children}
      </button>
    )
  }
)

export default DropdownItem
