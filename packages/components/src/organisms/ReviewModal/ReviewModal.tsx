import React from 'react'

import { Modal, ModalHeader, useUI } from '../..'
import type { ModalProps, OverlayProps } from '../..'

export interface ReviewModalProps extends ModalProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * The review modal's title.
   */
  title?: string
  /**
   * Close button aria-label.
   */
  closeButtonAriaLabel?: string
  /**
   * Props forwarded to the `Overlay` component.
   */
  overlayProps?: OverlayProps
  /**
   * Function called when modal is closed
   */
  onClose?: () => void
}

function ReviewModal({
  testId = 'fs-review-modal',
  title = 'Add a review',
  closeButtonAriaLabel = 'Close Add Review Modal',
  overlayProps,
  onClose,
  children,
  ...otherProps
}: ReviewModalProps) {
  const { closeReviewModal } = useUI()

  function handleOnClose() {
    closeReviewModal()
    onClose?.()
  }

  return (
    <Modal
      data-fs-review-modal
      testId={testId}
      overlayProps={overlayProps}
      title="Review modal"
      aria-label="Review modal"
      onTransitionEnd={(_, fade) => fade === 'out' && handleOnClose()}
      {...otherProps}
    >
      {({ fade, fadeOut, fadeIn }) => (
        <>
          <ModalHeader
            onClose={() => {
              fadeOut()
            }}
            title={title}
            closeBtnProps={{
              'aria-label': closeButtonAriaLabel,
            }}
            data-fs-review-modal-header
          />
          {typeof children === 'function'
            ? children({ fade, fadeOut, fadeIn })
            : children}
        </>
      )}
    </Modal>
  )
}

export default ReviewModal
