import {
  Button as UIButton,
  type ModalProps as UIModalProps,
  type ModalHeaderProps as UIModalHeaderProps,
  type ModalBodyProps as UIModalBodyProps,
  type ModalFooterProps as UIModalFooterProps,
  useUI,
} from '@faststore/ui'

import styles from './section.module.scss'

import dynamic from 'next/dynamic'

const UIModal = dynamic<UIModalProps>(
  () =>
    import(/* webpackChunkName: "UIModal" */ '@faststore/ui').then(
      (module) => module.Modal
    ),
  { ssr: false }
)

const UIModalHeader = dynamic<UIModalHeaderProps>(
  () =>
    import(/* webpackChunkName: "UIModalHeader" */ '@faststore/ui').then(
      (module) => module.ModalHeader
    ),
  { ssr: false }
)

const UIModalBody = dynamic<UIModalBodyProps>(
  () =>
    import(/* webpackChunkName: "UIModalBody" */ '@faststore/ui').then(
      (module) => module.ModalBody
    ),
  { ssr: false }
)

const UIModalFooter = dynamic<UIModalFooterProps>(
  () =>
    import(/* webpackChunkName: "UIModalFooter" */ '@faststore/ui').then(
      (module) => module.ModalFooter
    ),
  { ssr: false }
)

export interface ReviewModalProps {
  /**
   * The review modal's title.
   */
  title?: string
  /**
   * Close button aria-label.
   */
  closeButtonAriaLabel?: string
  /**
   * Cancel button label.
   */
  cancelButtonLabel?: string
  /**
   * Submit button label.
   */
  submitButtonLabel?: string
}

function ReviewModal({
  title = 'Add a review',
  closeButtonAriaLabel = 'Close Review Modal',
  cancelButtonLabel = 'Cancel',
  submitButtonLabel = 'Submit your review',
}: ReviewModalProps) {
  const { closeReviewModal } = useUI()

  const handleSubmit = async () => {
    // TODO: send review
  }

  function handleOnClose() {
    closeReviewModal()
  }

  return (
    <UIModal
      data-fs-review-modal
      title={title}
      onTransitionEnd={(_, fade) => fade === 'out' && handleOnClose()}
      overlayProps={{
        className: `section ${styles.section} section-review-modal`,
      }}
    >
      {({ fadeOut }) => (
        <>
          <UIModalHeader
            data-fs-review-modal-header
            title={title}
            onClose={() => {
              fadeOut()
            }}
            closeBtnProps={{
              'aria-label': closeButtonAriaLabel,
            }}
          />
          <UIModalBody data-fs-review-modal-body>
            {/* TODO: ReviewModal form will go here in another PR */}
            body
          </UIModalBody>
          <UIModalFooter data-fs-review-modal-footer>
            <UIButton variant="secondary" onClick={fadeOut}>
              {cancelButtonLabel}
            </UIButton>
            <UIButton variant="primary" onClick={handleSubmit}>
              {submitButtonLabel}
            </UIButton>
          </UIModalFooter>
        </>
      )}
    </UIModal>
  )
}

export default ReviewModal
