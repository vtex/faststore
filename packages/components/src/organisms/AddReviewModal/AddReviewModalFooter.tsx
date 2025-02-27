import React from 'react'

import { ModalFooter } from '../..'
import type { ModalFooterProps } from '../../molecules/Modal'

export interface AddReviewModalFooterProps extends ModalFooterProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

function AddReviewModalFooter({
  testId = 'fs-add-review-modal-footer',
  children,
  ...otherProps
}: AddReviewModalFooterProps) {
  return (
    <ModalFooter data-fs-add-review-modal-footer {...otherProps}>
      {children}
    </ModalFooter>
  )
}

export default AddReviewModalFooter
