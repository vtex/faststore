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
  trapFocusRef: RefObject<HTMLDivElement>
  testId?: string
}

const ModalContentPure = ({
  trapFocusRef,
  testId = 'store-modal-content',
  children,
  ...props
}: ModalContentPureProps) => {
  return (
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
  )
}

export type ModalContentProps = Omit<
  ModalContentPureProps,
  'trapFocusRef' | 'onClick'
>

const ModalContent = ({ children, ...props }: ModalContentProps) => {
  const trapFocusRef = useRef<HTMLDivElement>(null)

  useTrapFocus({
    trapFocusRef,
  })

  return (
    <ModalContentPure
      {...props}
      trapFocusRef={trapFocusRef}
      onClick={(event: MouseEvent) => {
        event.stopPropagation()
      }}
    >
      {children}
    </ModalContentPure>
  )
}

export default ModalContent
