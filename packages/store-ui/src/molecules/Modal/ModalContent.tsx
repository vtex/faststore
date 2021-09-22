/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/*
 * Disable the eslint rule to use sentinel html elements that aren't interactive.
 */
import type {
  DetailedHTMLProps,
  HTMLAttributes,
  MouseEvent,
  RefObject,
} from 'react'
import React, { useRef } from 'react'

import useTrapFocus from './useTrapFocus'

interface ModalContentPureProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    'ref'
  > {
  sentinelStartRef: RefObject<HTMLDivElement>
  trapFocusRef: RefObject<HTMLDivElement>
  sentinelEndRef: RefObject<HTMLDivElement>
}

const ModalContentPure = ({
  trapFocusRef,
  sentinelStartRef,
  sentinelEndRef,
  children,
  ...props
}: ModalContentPureProps) => {
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
        data-store-modal-content
        {...props}
        ref={trapFocusRef}
        aria-modal="true"
        role="dialog"
        tabIndex={-1}
      >
        {children}
      </div>
      <div tabIndex={0} data-testid="sentinelEnd" ref={sentinelEndRef} />
    </>
  )
}

export type ModalContentProps = Omit<
  ModalContentPureProps,
  'sentinelStartRef' | 'sentinelEndRef' | 'trapFocusRef'
>

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
    <ModalContentPure
      {...props}
      trapFocusRef={trapFocusRef}
      sentinelStartRef={sentinelStartRef}
      sentinelEndRef={sentinelEndRef}
      onClick={(event: MouseEvent) => {
        event.stopPropagation()
      }}
    >
      {children}
    </ModalContentPure>
  )
}

export default ModalContent
