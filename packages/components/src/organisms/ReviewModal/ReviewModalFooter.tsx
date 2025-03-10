import React from 'react'

import { ModalFooter } from '../..'
import type { ModalFooterProps } from '../../molecules/Modal'

export interface ReviewModalFooterProps extends ModalFooterProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

function ReviewModalFooter({
  testId = 'fs-review-modal-footer',
  children,
  ...otherProps
}: ReviewModalFooterProps) {
  return (
    <ModalFooter data-fs-review-modal-footer {...otherProps}>
      {children}
    </ModalFooter>
  )
}

export default ReviewModalFooter
