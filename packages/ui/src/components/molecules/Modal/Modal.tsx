import type {
  AriaAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from 'react'
import React from 'react'
import { createPortal } from 'react-dom'

import { Overlay, type OverlayProps } from '../..'
import { useFadeEffect, useUI } from '../../hooks'
import type { ModalContentProps } from './ModalContent'
import ModalContent from './ModalContent'

export type ModalChildrenProps = {
  fade: 'in' | 'out'
  fadeOut: () => void
  fadeIn: () => void
}

type ModalChildrenFunction = (props: ModalChildrenProps) => ReactNode

export interface ModalProps
  extends Omit<ModalContentProps, 'children' | 'onEntered'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
  /**
   * Identifies the element (or elements) that labels the current element.
   * @see aria-labelledby https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby
   */
  'aria-labelledby'?: AriaAttributes['aria-label']
  /**
   * A boolean value that represents the state of the Modal.
   */
  isOpen?: boolean
  /**
   * Event emitted when the modal is closed.
   */
  onDismiss?: () => void
  /**
   * Callback function when the modal is opened.
   */
  onEntered?: () => void
  /**
   * Props forwarded to the `Overlay` component.
   */
  overlayProps?: OverlayProps
  /**
   * Children or function as a children.
   */
  children: ModalChildrenFunction | ReactNode
  /**
   * Disable being closed using the Escape key.
   */
  disableEscapeKeyDown?: boolean
}

/*
 * This component is based on @reach/dialog.
 * https://github.com/reach/reach-ui/blob/main/packages/dialog/src/index.tsx
 * https://reach.tech/dialog
 */
export default function Modal({
  children,
  testId = 'fs-modal',
  isOpen = true,
  onDismiss,
  overlayProps,
  disableEscapeKeyDown = false,
  onEntered,
  ...otherProps
}: ModalProps) {
  const { closeModal } = useUI()
  const { fade, fadeOut, fadeIn } = useFadeEffect()

  const handleBackdropClick = (event: MouseEvent) => {
    if (disableEscapeKeyDown || event.defaultPrevented) {
      return
    }

    event.stopPropagation()
    fadeOut?.()
    onDismiss?.()
  }

  const handleBackdropKeyDown = (event: KeyboardEvent) => {
    if (
      disableEscapeKeyDown ||
      event.key !== 'Escape' ||
      event.defaultPrevented
    ) {
      return
    }

    event.stopPropagation()
    fadeOut?.()
    onDismiss?.()
  }

  return isOpen
    ? createPortal(
        <Overlay
          onClick={handleBackdropClick}
          onKeyDown={handleBackdropKeyDown}
          {...overlayProps}
        >
          <ModalContent
            onTransitionEnd={(e) => {
              // Checks if the event wast triggered by this modal or is a bubble event
              if ((e.target as HTMLElement)?.dataset?.testid !== testId) return
              // TODO:
              // Using onTransitionEnd can lead to unexpected behavior. Since ModalContentPure uses the useTrapFocus hook,
              // focus is automatically moved to the first focusable element inside the modal—typically the Close Button.
              // This causes the onTransitionEnd event listener to attach to the Close Button instead of the ModalContent.
              // As a result, we may end up listening to the transition of the button (e.g., its focus animation) rather than
              // the intended transform transition of the modal content, which can introduce bugs during modal animations.
              if (fade === 'out') {
                closeModal()
              } else if (fade === 'in' && onEntered) {
                onEntered()
              }
            }}
            data-fs-modal
            data-fs-modal-state={fade}
            testId={testId}
            {...otherProps}
          >
            {typeof children === 'function'
              ? children({ fade, fadeOut, fadeIn })
              : children}
          </ModalContent>
        </Overlay>,
        document.body
      )
    : null
}
