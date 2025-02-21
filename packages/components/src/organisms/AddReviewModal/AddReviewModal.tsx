import React from 'react'

import { Modal, ModalHeader, useUI } from '../..'
import type { ModalProps, OverlayProps } from '../..'

export interface AddReviewModalProps extends ModalProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * The add-review modal's title.
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

function AddReviewModal({
  testId = 'fs-add-review-modal',
  title = 'Add a review',
  closeButtonAriaLabel = 'Close Add Review Modal',
  overlayProps,
  onClose,
  children,
  ...otherProps
}: AddReviewModalProps) {
  const { closeAddReviewModal } = useUI()

  function handleOnClose() {
    closeAddReviewModal()
    onClose?.()
  }

  return (
    <Modal
      data-fs-add-review-modal
      testId={testId}
      overlayProps={overlayProps}
      title="Add Review modal"
      aria-label="Add Review modal"
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
          />
          {typeof children === 'function'
            ? children({ fade, fadeOut, fadeIn })
            : children}
        </>
      )}
    </Modal>
  )
}

export default AddReviewModal
