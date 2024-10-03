import React, { useImperativeHandle, useRef, useState } from 'react'

import { useDropdown } from './useDropdown'

export type UseDropdownItemProps<
  E extends HTMLElement = HTMLElement,
> = {
  ref: React.ForwardedRef<E>
  onClick?: React.MouseEventHandler<E>
  dismissOnClick?: boolean
}

export const useDropdownItem = <
  E extends HTMLElement = HTMLElement,
>({
  ref,
  onClick,
  dismissOnClick = true
}: UseDropdownItemProps<E>) => {
  const { dropdownItemsRef, selectedDropdownItemIndexRef, 
    close 
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
    selectedDropdownItemIndexRef!.current = dropdownItemIndex;
    (dropdownItemsRef?.current[selectedDropdownItemIndexRef!.current])?.focus()
  }

  const handleOnClickItem = (
    event: React.MouseEvent<E, MouseEvent>
  ) => {
    onClick?.(event)
    dismissOnClick && close?.()
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
