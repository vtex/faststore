import type {
  AriaAttributes,
  KeyboardEvent,
  MouseEvent,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from 'react'
import React from 'react'
import { createPortal } from 'react-dom'

import Overlay from '../../atoms/Overlay'
import ModalContent from './ModalContent'
import type { ModalContentProps } from './ModalContent'

type OnlyChildrenProps<
  T extends { children?: ReactNode } = { children?: ReactNode }
> = Pick<T, 'children'>

interface ModalPureProps extends ModalContentProps {
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
   * Overlay component for modal
   */
  overlay: (props: OnlyChildrenProps) => ReactElement
}

const ModalPure = ({
  testId = 'store-modal',
  children,
  overlay: ModalOverlay,
  ...props
}: ModalPureProps) => {
  return (
    <ModalOverlay>
      <ModalContent {...props} data-testid={testId}>
        {children}
      </ModalContent>
    </ModalOverlay>
  )
}

export interface ModalProps
  extends Omit<
    ModalPureProps,
    'onBackdropKeyDown' | 'onBackdropClick' | 'overlay'
  > {
  /**
   * This function is called whenever the user hits "Escape" or clicks outside
   * the dialog.
   */
  onDismiss?: (event: MouseEvent | KeyboardEvent) => void
  /**
   * Controls whether or not the dialog is open.
   */
  isOpen: boolean
}

/**
 * This component is based on @reach/dialog.
 * https://github.com/reach/reach-ui/blob/main/packages/dialog/src/index.tsx
 * https://reach.tech/dialog
 */

const Modal = ({
  isOpen,
  children,
  onDismiss,
  ...props
}: PropsWithChildren<ModalProps>) => {
  const handleBackdropClick = (event: MouseEvent) => {
    if (event.defaultPrevented) {
      return
    }

    event.stopPropagation()
    onDismiss?.(event)
  }

  const handleBackdropKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || event.defaultPrevented) {
      return
    }

    event.stopPropagation()
  }

  const ModalOverlay = ({
    children: modalContent,
  }: PropsWithChildren<unknown>) => {
    return (
      <Overlay
        data-modal-overlay
        onClick={handleBackdropClick}
        onKeyDown={handleBackdropKeyDown}
      >
        {modalContent}
      </Overlay>
    )
  }

  return isOpen
    ? createPortal(
        <ModalPure {...props} overlay={ModalOverlay}>
          {children}
        </ModalPure>,
        document.body
      )
    : null
}

export default Modal
