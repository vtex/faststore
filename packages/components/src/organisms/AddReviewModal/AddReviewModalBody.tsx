import React from 'react'

import { ModalBody } from '../..'
import type { ModalBodyProps } from '../../molecules/Modal'

export interface AddReviewModalBodyProps extends ModalBodyProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

function AddReviewModalBody({
  testId = 'fs-add-review-modal-body',
  children,
  ...otherProps
}: AddReviewModalBodyProps) {
  return (
    <ModalBody data-fs-add-review-modal-body {...otherProps}>
      {children}
    </ModalBody>
  )
}

export default AddReviewModalBody
