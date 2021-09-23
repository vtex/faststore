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
  testId?: string
}

const ModalContentPure = ({
  trapFocusRef,
  sentinelStartRef,
  sentinelEndRef,
  testId = 'store-modal-content',
  children,
  ...props
}: ModalContentPureProps) => {
  return (
    <>
      <div tabIndex={0} data-testid="sentinelStart" ref={sentinelStartRef} />
      {/*
       * This next line is disabled due to the onClick prop.
       * Even though a div isn't clickable, the onClick is required to prevent event bubbles
       * from reaching the Overlay, which calls onDismiss inside the onClick handler when it's clicked.
       */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div
        data-store-modal-content
        {...props}
        data-testid={testId}
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
  'sentinelStartRef' | 'sentinelEndRef' | 'trapFocusRef' | 'onClick'
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
