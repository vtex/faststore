import type {
  AriaAttributes,
  KeyboardEvent,
  PropsWithChildren,
  MouseEvent,
  ReactNode,
} from 'react'
import React from 'react'
import { createPortal } from 'react-dom'

import { useDropdown } from './hooks/useDropdown'
import { useDropdownPosition } from './hooks/useDropdownPosition'
import type { ModalContentProps } from './../Modal/ModalContent'

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

   /**
   * Specifies the size variant.
   */
  size?: 'small' | 'regular'

  children: ReactNode[] | ReactNode
}

/*
 * This component is based on @reach/dialog.
 * https://github.com/reach/reach-ui/blob/main/packages/dialog/src/index.tsx
 * https://reach.tech/dialog
 */

const DropdownMenu = ({
  children,
  testId = 'fs-dropdown-menu',
  size = 'regular',
  style,
  ...otherProps
}: PropsWithChildren<DropdownMenuProps>) => {
  const { isOpen, close, dropdownItemsRef, selectedDropdownItemIndexRef, dropdownButtonRef, id } =
    useDropdown()

  const dropdownPosition = useDropdownPosition()

  const childrenLength = React.Children.toArray(children).length

  const handleDownPress = () => {
    if (selectedDropdownItemIndexRef!.current < childrenLength - 1) {
      selectedDropdownItemIndexRef!.current++
    } else {
      selectedDropdownItemIndexRef!.current = 0
    }

    dropdownItemsRef?.current[selectedDropdownItemIndexRef!.current]?.focus()
  }

  const handleUpPress = () => {
    if (selectedDropdownItemIndexRef!.current > 0) {
      selectedDropdownItemIndexRef!.current--
    } else {
      selectedDropdownItemIndexRef!.current = childrenLength - 1
    }

    dropdownItemsRef?.current[selectedDropdownItemIndexRef!.current]?.focus()
  }

  const handleHomePress = () => {
    selectedDropdownItemIndexRef!.current = 0
    dropdownItemsRef?.current[selectedDropdownItemIndexRef!.current]?.focus()
  }

  const handleEndPress = () => {
    selectedDropdownItemIndexRef!.current = childrenLength - 1
    dropdownItemsRef?.current[selectedDropdownItemIndexRef!.current]?.focus()
  }

  const handleEscapePress = () => {
    close?.()
    dropdownButtonRef?.current?.focus()
  }

  const handleBackdropKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.key === 'Enter') {
      return
    }

    event.preventDefault()

    event.key === 'Escape' && handleEscapePress()

    event.key === 'ArrowDown' && handleDownPress()

    event.key === 'ArrowUp' && handleUpPress()

    event.key === 'Home' && handleHomePress()

    event.key === 'End' && handleEndPress()

    event.stopPropagation()
  }

  const clearChildrenReferences = () => {
    dropdownItemsRef!.current = []

    return null
  }

  return isOpen
    ? createPortal(
        <div
          role="presentation"
          data-fs-dropdown-overlay
          onKeyDown={handleBackdropKeyDown}
          data-testid={`${testId}-overlay`}
        >
          <div
            role="menu"
            aria-orientation="vertical"
            data-fs-dropdown-menu
            data-fs-dropdown-menu-size={size}
            data-testid={testId}
            style={{ ...dropdownPosition, ...style }}
            id={id}
            {...otherProps}
          >
            {children}
          </div>
        </div>,
        document.body
      )
    : clearChildrenReferences()
}

export default DropdownMenu
