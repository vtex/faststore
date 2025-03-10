import React from 'react'

import { ModalBody } from '../..'
import type { ModalBodyProps } from '../../molecules/Modal'

export interface ReviewModalBodyProps extends ModalBodyProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

function ReviewModalBody({
  testId = 'fs-review-modal-body',
  children,
  ...otherProps
}: ReviewModalBodyProps) {
  return (
    <ModalBody data-fs-review-modal-body {...otherProps}>
      {children}
    </ModalBody>
  )
}

export default ReviewModalBody
