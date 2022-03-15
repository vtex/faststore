import type {
  AriaAttributes,
  KeyboardEvent,
  MouseEvent,
  PropsWithChildren,
  ReactElement,
} from 'react'
import React, { Children, useRef } from 'react'
import { createPortal } from 'react-dom'

import Overlay from '../../atoms/Overlay'
import type { ModalContentProps } from '../Modal/ModalContent'
import ModalContent from '../Modal/ModalContent'
import { useDropdown } from './contexts/DropdownContext'
import { useDropdownPosition } from './hooks/useDropdownPosition'

export type FocusableElement = {
  focus(): void
}

export interface ModalProps extends ModalContentProps {
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

const Modal = ({
  children,
  testId = 'store-modal',
  ...otherProps
}: PropsWithChildren<ModalProps>) => {
  const { isOpen, close, onDismiss } = useDropdown()
  const dropdownPosition = useDropdownPosition()

  const childrenLenght = children.length

  const childrenRefs = useRef<FocusableElement[]>([])
  const selectedChildren = useRef(0)

  const handleBackdropClick = (event: MouseEvent) => {
    if (event.defaultPrevented) {
      return
    }

    event.stopPropagation()
    onDismiss?.()
    close?.()
  }

  const handlerDownPress = () => {
    if (selectedChildren.current < childrenLenght - 1) {
      selectedChildren.current++
    } else {
      selectedChildren.current = 0
    }

    childrenRefs.current[selectedChildren.current]?.focus()
  }

  const handlerUpPress = () => {
    if (selectedChildren.current > 0) {
      selectedChildren.current--
    } else {
      selectedChildren.current = childrenLenght - 1
    }

    childrenRefs.current[selectedChildren.current]?.focus()
  }

  const handlerEscapePress = () => {
    onDismiss?.()
    close?.()
  }

  const handleBackdropKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return
    }

    if (event.key === 'Escape') {
      handlerEscapePress()
    }

    if (event.key === 'ArrowDown') {
      handlerDownPress()
    }

    if (event.key === 'ArrowUp') {
      handlerUpPress()
    }

    event.stopPropagation()
  }

  const addToRefs = (el: HTMLButtonElement) => {
    if (el && !childrenRefs.current.includes(el)) {
      childrenRefs.current.push(el)
    }
  }

  const onFocusItem = (index: number) => {
    selectedChildren.current = index
  }

  const clearChildrenReferences = () => {
    childrenRefs.current = []

    return null
  }

  return isOpen
    ? createPortal(
        <Overlay
          data-dropdown-overlay
          onClick={handleBackdropClick}
          onKeyDown={handleBackdropKeyDown}
        >
          <ModalContent
            {...otherProps}
            data-dropdown-content
            testId={testId}
            style={{ ...dropdownPosition }}
          >
            {Children.map(children, (child, index) => {
              return React.cloneElement(child, {
                ref: addToRefs,
                onFocus: () => onFocusItem(index),
              })
            })}
          </ModalContent>
        </Overlay>,
        document.body
      )
    : clearChildrenReferences()
}

export default Modal
