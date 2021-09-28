/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
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
  beforeElementRef: RefObject<HTMLDivElement>
  trapFocusRef: RefObject<HTMLDivElement>
  afterElementRef: RefObject<HTMLDivElement>
  testId?: string
}

const ModalContentPure = ({
  beforeElementRef,
  trapFocusRef,
  afterElementRef,
  testId = 'store-modal-content',
  children,
  ...props
}: ModalContentPureProps) => {
  return (
    <>
      <div
        ref={beforeElementRef}
        data-testid="beforeElement"
        tabIndex={0}
        aria-hidden="true"
      />
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
      <div
        ref={afterElementRef}
        data-testid="afterElement"
        tabIndex={0}
        aria-hidden="true"
      />
    </>
  )
}

export type ModalContentProps = Omit<
  ModalContentPureProps,
  'trapFocusRef' | 'onClick' | 'beforeElementRef' | 'afterElementRef'
>

const ModalContent = ({ children, ...props }: ModalContentProps) => {
  const trapFocusRef = useRef<HTMLDivElement>(null)
  const beforeElementRef = useRef<HTMLDivElement>(null)
  const afterElementRef = useRef<HTMLDivElement>(null)

  useTrapFocus({
    beforeElementRef,
    trapFocusRef,
    afterElementRef,
  })

  return (
    <ModalContentPure
      {...props}
      trapFocusRef={trapFocusRef}
      beforeElementRef={beforeElementRef}
      afterElementRef={afterElementRef}
      onClick={(event: MouseEvent) => {
        event.stopPropagation()
      }}
    >
      {children}
    </ModalContentPure>
  )
}

export default ModalContent
