import {
  Button,
  type AddReviewModalProps as UIAddReviewModalProps,
  type AddReviewModalBodyProps as UIAddReviewModalBodyProps,
  type AddReviewModalFooterProps as UIAddReviewModalFooterProps,
} from '@faststore/ui'

import styles from './section.module.scss'

import dynamic from 'next/dynamic'

const UIAddReviewModal = dynamic<UIAddReviewModalProps>(
  () =>
    import(/* webpackChunkName: "UIAddReviewModal" */ '@faststore/ui').then(
      (mod) => mod.AddReviewModal
    ),
  { ssr: false }
)

const UIAddReviewModalBody = dynamic<UIAddReviewModalBodyProps>(
  () =>
    import(/* webpackChunkName: "UIAddReviewModalBody" */ '@faststore/ui').then(
      (mod) => mod.AddReviewModalBody
    ),
  { ssr: false }
)

const UIAddReviewModalFooter = dynamic<UIAddReviewModalFooterProps>(
  () =>
    import(
      /* webpackChunkName: "UIAddReviewModalFooter" */ '@faststore/ui'
    ).then((mod) => mod.AddReviewModalFooter),
  { ssr: false }
)

interface AddReviewModalProps {
  title?: UIAddReviewModalProps['title']
  closeButtonAriaLabel?: UIAddReviewModalProps['closeButtonAriaLabel']
  closeButtonLabel: string
  submitButtonLabel: string
}

function AddReviewModal({
  title,
  closeButtonAriaLabel,
  closeButtonLabel,
  submitButtonLabel,
}: AddReviewModalProps) {
  const handleSubmit = async () => {
    // TODO: send review
  }

  return (
    <UIAddReviewModal
      title={title}
      overlayProps={{
        className: `section ${styles.section} section-add-review-modal`,
      }}
      closeButtonAriaLabel={closeButtonAriaLabel}
    >
      {({ fadeOut }) => (
        <>
          <UIAddReviewModalBody>
            {/* TODO: AddReviewModal form will go here in another PR */}
            body
          </UIAddReviewModalBody>
          <UIAddReviewModalFooter data-fs-add-review-modal-footer>
            <Button variant="secondary" onClick={fadeOut}>
              {closeButtonLabel}
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {submitButtonLabel}
            </Button>
          </UIAddReviewModalFooter>
        </>
      )}
    </UIAddReviewModal>
  )
}

export default AddReviewModal
