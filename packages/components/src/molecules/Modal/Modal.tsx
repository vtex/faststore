import type {
  AriaAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from 'react'
import React from 'react'
import { createPortal } from 'react-dom'

import { Overlay } from '../..'
import { useFadeEffect, useUI } from '../../hooks'
import type { ModalContentProps } from './ModalContent'
import ModalContent from './ModalContent'

export type ModalChildrenProps = {
  fade: 'in' | 'out'
  fadeOut: () => void
  fadeIn: () => void
}

type ModalChildrenFunction = (props: ModalChildrenProps) => ReactNode

export interface ModalProps extends Omit<ModalContentProps, "children"> {
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
   * A boolean value that represents the state of the Modal
   */
  isOpen?: boolean
  /**
   * Children or function 
   */
  children: ModalChildrenFunction | ReactNode
}

/*
 * This component is based on @reach/dialog.
 * https://github.com/reach/reach-ui/blob/main/packages/dialog/src/index.tsx
 * https://reach.tech/dialog
 */

const Modal = ({
  children,
  testId = 'fs-modal',
  isOpen = false,
  ...otherProps
}: ModalProps) => {
  const { closeModal } = useUI()
  const { fade, fadeOut, fadeIn } = useFadeEffect()

  const handleBackdropClick = (event: MouseEvent) => {
    if (event.defaultPrevented) {
      return
    }

    event.stopPropagation()
    fadeOut?.()
  }

  const handleBackdropKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || event.defaultPrevented) {
      return
    }

    event.stopPropagation()
    fadeOut()
  }

  return isOpen 
    ? createPortal(
        <Overlay
          onClick={handleBackdropClick}
          onKeyDown={handleBackdropKeyDown}
        >
          <ModalContent
            onTransitionEnd={() => fade === 'out' && closeModal()}
            data-modal
            data-modal-state={fade}
            testId={testId}
            {...otherProps} 
          >
            {
              typeof children === 'function'
              ? children({ fade, fadeOut, fadeIn })
              : children
            }
          </ModalContent>
        </Overlay>,
        document.body
      )
    : null
}

export default Modal
