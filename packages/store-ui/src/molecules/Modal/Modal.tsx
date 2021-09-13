import type { PropsWithChildren } from 'react'
import React from 'react'
import type { DialogProps } from '@reach/dialog'
import { Dialog } from '@reach/dialog'

export interface Props extends DialogProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Set the modal state.
   */
  isOpen?: boolean
}

const Modal = ({
  isOpen,
  children,
  testId = 'store-modal',
  ...props
}: PropsWithChildren<Props>) => {
  return (
    isOpen && (
      <Dialog data-testid={testId} data-store-modal {...props}>
        {children}
      </Dialog>
    )
  )
}

export default Modal
