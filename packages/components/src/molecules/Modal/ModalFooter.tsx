import React, { type ReactNode, type HTMLAttributes } from 'react'

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Children or function as a children
   */
  children: ReactNode
  /**
   * Layout direction. Default is `horizontal`.
   */
  direction?: 'horizontal' | 'vertical'
  /**
   * Allows wrapping. Default is `true`
   */
  wrap?: boolean
}

const ModalFooter = ({
  children,
  direction = 'horizontal',
  wrap = true,
  ...otherProps
}: ModalFooterProps) => (
  <div data-fs-modal-footer {...otherProps}>
    <div
      data-fs-modal-footer-actions
      data-fs-modal-footer-actions-direction={direction}
      data-fs-modal-footer-actions-wrap={wrap}
    >
      {children}
    </div>
  </div>
)

export default ModalFooter
