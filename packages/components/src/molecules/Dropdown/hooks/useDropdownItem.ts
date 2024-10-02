import React, { useImperativeHandle, useRef, useState } from 'react'

import { DropdownItemElement } from '../contexts/DropdownContext'
import { useDropdown } from './useDropdown'

export type UseDropdownItemProps<
  E extends DropdownItemElement = DropdownItemElement,
> = {
  ref: React.ForwardedRef<E>
  onClick?: React.MouseEventHandler<E>
}

export const useDropdownItem = <
  E extends DropdownItemElement = DropdownItemElement,
>({
  ref,
  onClick,
}: UseDropdownItemProps<E>) => {
  const { dropdownItemsRef, selectedDropdownItemIndexRef, 
    // close 
  } = useDropdown<
    never,
    E
  >()

  const [dropdownItemIndex, setDropdownItemIndex] = useState(0)
  const dropdownItemRef = useRef<E>()

  const addToRefs = (el: E) => {
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
    event: React.MouseEvent<E, MouseEvent>
  ) => {
    onClick?.(event)
    // close?.()
  }

  useImperativeHandle(ref, () => dropdownItemRef.current!, [])

  return {
    ref: addToRefs,
    onFocus: onFocusItem,
    onMouseEnter: onFocusItem,
    onClick: handleOnClickItem,
    role: 'menuitem',
    tabIndex: -1,
    'data-index': dropdownItemIndex,
  }
}
