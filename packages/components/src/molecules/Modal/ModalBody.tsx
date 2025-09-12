import React, { type ReactNode, type HTMLAttributes } from 'react'

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Children or function as a children
   */
  children: ReactNode
}

export default function ModalBody({ children, ...otherProps }: ModalBodyProps) {
  return (
    <div data-fs-modal-body {...otherProps}>
      {children}
    </div>
  )
}
