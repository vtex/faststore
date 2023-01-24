import React, { ReactNode, HTMLAttributes } from 'react'

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const ModalBody = ({ children, ...otherProps }: ModalBodyProps) => (
  <div data-fs-modal-body {...otherProps}>
    {children}
  </div>
)

export default ModalBody
