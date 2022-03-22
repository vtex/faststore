import type {
  AriaAttributes,
  KeyboardEvent,
  MouseEvent,
  PropsWithChildren,
  ReactElement,
} from 'react'
import React from 'react'
import { createPortal } from 'react-dom'

import Overlay from '../../atoms/Overlay'
import type { ModalContentProps } from '../Modal/ModalContent'
import { useDropdown } from './hooks/useDropdown'
import { useDropdownPosition } from './hooks/useDropdownPosition'

export interface DropdownMenuProps extends ModalContentProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Identifies the element (or elements) that labels the current element.
   * @see aria-labelledby https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby
   */
  'aria-labelledby'?: AriaAttributes['aria-label']

  /**
   * This function is called whenever the user hits "Escape" or clicks outside
   * the dialog.
   */
  onDismiss?: (event: MouseEvent | KeyboardEvent) => void

  children: ReactElement[]
}

/*
 * This component is based on @reach/dialog.
 * https://github.com/reach/reach-ui/blob/main/packages/dialog/src/index.tsx
 * https://reach.tech/dialog
 */

const DropdownMenu = ({
  children,
  testId = 'store-dropdown-menu',
  style,
  ...otherProps
}: PropsWithChildren<DropdownMenuProps>) => {
  const {
    isOpen,
    close,
    onDismiss,
    dropdownItemsRef,
    selectedDropdownItemRef,
    id,
  } = useDropdown()

  const dropdownPosition = useDropdownPosition()

  const childrenLenght = children.length

  const handleBackdropClick = (event: MouseEvent) => {
    if (event.defaultPrevented) {
      return
    }

    event.stopPropagation()
    onDismiss?.()
    close?.()
  }

  const handlerDownPress = () => {
    if (selectedDropdownItemRef!.current < childrenLenght - 1) {
      selectedDropdownItemRef!.current++
    } else {
      selectedDropdownItemRef!.current = 0
    }

    dropdownItemsRef?.current[selectedDropdownItemRef!.current]?.focus()
  }

  const handlerUpPress = () => {
    if (selectedDropdownItemRef!.current > 0) {
      selectedDropdownItemRef!.current--
    } else {
      selectedDropdownItemRef!.current = childrenLenght - 1
    }

    dropdownItemsRef?.current[selectedDropdownItemRef!.current]?.focus()
  }

  const handlerHomePress = () => {
    selectedDropdownItemRef!.current = 0
    dropdownItemsRef?.current[selectedDropdownItemRef!.current]?.focus()
  }

  const handlerEndPress = () => {
    selectedDropdownItemRef!.current = childrenLenght - 1
    dropdownItemsRef?.current[selectedDropdownItemRef!.current]?.focus()
  }

  const handlerEscapePress = () => {
    onDismiss?.()
    close?.()
  }

  const handleBackdropKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return
    }

    event.key === 'Escape' && handlerEscapePress()

    event.key === 'ArrowDown' && handlerDownPress()

    event.key === 'ArrowUp' && handlerUpPress()

    event.key === 'Home' && handlerHomePress()

    event.key === 'End' && handlerEndPress()

    event.key === 'Tab' && event.preventDefault()

    event.stopPropagation()
  }

  const clearChildrenReferences = () => {
    dropdownItemsRef!.current = []

    return null
  }

  return isOpen
    ? createPortal(
        <Overlay
          data-store-dropdown-overlay
          onClick={handleBackdropClick}
          onKeyDown={handleBackdropKeyDown}
        >
          <div
            role="menu"
            aria-orientation="vertical"
            data-store-dropdown-menu
            data-testid={testId}
            style={{ ...dropdownPosition, ...style }}
            id={id}
            {...otherProps}
          >
            {children}
          </div>
        </Overlay>,
        document.body
      )
    : clearChildrenReferences()
}

export default DropdownMenu
