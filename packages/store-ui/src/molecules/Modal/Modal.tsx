/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/*
 * Disable the eslint rule to use sentinel html elements that aren't interactive.
 */
import type {
  AriaAttributes,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  PropsWithChildren,
} from 'react'
import React, { useRef } from 'react'
import { createPortal } from 'react-dom'

import Overlay from '../../atoms/Overlay'
import useTrapFocus from './useTrapFocus'

const composeEventHandler = <EventType extends React.SyntheticEvent | Event>(
  handler: ((event: EventType) => void) | undefined,
  internalHandler: (event: EventType) => void
) => {
  return (event: EventType) => {
    handler?.(event)
    if (!event.defaultPrevented) {
      internalHandler(event)
    }
  }
}

interface ModalContentProps extends HTMLAttributes<HTMLDivElement> {
  testId?: string
  onDismiss?: (event: MouseEvent | KeyboardEvent) => void
}

const ModalContent = ({ children, ...props }: ModalContentProps) => {
  const trapFocusRef = useRef<HTMLDivElement>(null)
  const sentinelStartRef = useRef<HTMLDivElement>(null)
  const sentinelEndRef = useRef<HTMLDivElement>(null)

  useTrapFocus({
    sentinelStartRef,
    sentinelEndRef,
    trapFocusRef,
  })

  return (
    <>
      <div tabIndex={0} data-testid="sentinelStart" ref={sentinelStartRef} />
      {/*
       * This next line is disabled due to the onClick prop.
       * Even though div isn't clickable, the onClick is required to prevent the event bubbles
       * until the overlay, which calls onDismiss inside the onClick handler, is clicked.
       */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div
        ref={trapFocusRef}
        aria-modal="true"
        role="dialog"
        tabIndex={-1}
        {...props}
        onClick={(event: MouseEvent) => {
          event.stopPropagation()
        }}
      >
        {children}
      </div>
      <div tabIndex={0} data-testid="sentinelEnd" ref={sentinelEndRef} />
    </>
  )
}

export interface ModalProps extends ModalContentProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Controls whether or not the dialog is open.
   */
  isOpen: boolean
  /**
   * This function is called whenever the user hits "Escape" or clicks outside
   * the dialog.
   */
  onDismiss?: (event: MouseEvent | KeyboardEvent) => void
  /**
   * Identifies the element (or elements) that labels the current element.
   * @see aria-labelledby https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby
   */
  'aria-labelledby'?: AriaAttributes['aria-label']
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
  testId,
  onClick,
  onKeyDown,
  ...props
}: PropsWithChildren<ModalProps>) => {
  const handleClick = (event: MouseEvent) => {
    event.stopPropagation()
    onDismiss?.(event)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onDismiss?.(event)
    }
  }

  return isOpen
    ? createPortal(
        <Overlay
          data-modal-overlay
          onClick={composeEventHandler(onClick, handleClick)}
          onKeyDown={composeEventHandler(onKeyDown, handleKeyDown)}
        >
          <ModalContent data-store-modal data-testid={testId} {...props}>
            {children}
          </ModalContent>
        </Overlay>,
        document.body
      )
    : null
}

export default Modal
