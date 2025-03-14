import {
  type ModalProps as UIModalProps,
  type ModalHeaderProps as UIModalHeaderProps,
  useUI,
} from '@faststore/ui'

import styles from './section.module.scss'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useState } from 'react'
import { useAddReview } from 'src/sdk/reviews/useAddReview'

import isUUID from 'src/utils/isUUID'
import type {
  ReviewModalFormData,
  ReviewModalFormProps,
} from './ReviewModalForm'
import type { ReviewModalSuccessProps } from './ReviewModalSuccess'

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

const ReviewModalSuccess = dynamic(
  () =>
    import(
      /* webpackChunkName: "ReviewModalSuccess" */ 'src/components/reviews/ReviewModal/ReviewModalSuccess'
    ),
  { ssr: false }
)

const ReviewModalForm = dynamic(
  () =>
    import(
      /* webpackChunkName: "ReviewModalForm" */ 'src/components/reviews/ReviewModal/ReviewModalForm'
    ),
  { ssr: false }
)

const UIIcon = dynamic(
  () => import('@faststore/ui').then((module) => module.Icon),
  {
    ssr: false,
  }
)

export interface ReviewModalProps
  extends Omit<ReviewModalFormProps, 'onSubmit' | 'onCancel'>,
    ReviewModalSuccessProps {
  /**
   * The review modal's title.
   */
  title?: string
  /**
   * Close button aria-label.
   */
  closeButtonAriaLabel?: string
}

function ReviewModal({
  title = 'Add a review',
  closeButtonAriaLabel = 'Close Review Modal',
  product,
  successTitle,
  successSubtitle,
  successButtonLabel,
  ...formProps
}: ReviewModalProps) {
  const { pushToast, closeReviewModal } = useUI()
  const { createProductReview, data, error, loading } = useAddReview()
  const [submittedReview, setSubmittedReview] =
    useState<ReviewModalFormData | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  function pushErrorToast(message = 'Something went wrong.') {
    pushToast({
      title: 'Oops.',
      message,
      status: 'ERROR',
      icon: <UIIcon name="CircleWavyWarning" width={30} height={30} />,
    })
  }

  const handleSubmit = useCallback(
    (formData: ReviewModalFormData) => {
      try {
        createProductReview({
          data: {
            productId: product.id,
            rating: formData.rating,
            title: formData.title,
            text: formData.text,
            reviewerName: formData.reviewerName,
          },
        })
          .then(() => {
            setSubmittedReview(formData)
          })
          .catch((error) => {
            pushErrorToast()
          })
      } catch (error) {
        pushErrorToast()
      }
    },
    [product.id, createProductReview]
  )

  useEffect(() => {
    if (submittedReview) {
      if (data?.createProductReview && isUUID(data.createProductReview)) {
        setIsSuccess(true)
      } else {
        pushErrorToast(data?.createProductReview)
      }
    }
  }, [submittedReview, data, error])

  return (
    <UIModal
      data-fs-review-modal
      title={title}
      onTransitionEnd={(_, fade) => fade === 'out' && closeReviewModal()}
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
          {isSuccess ? (
            <ReviewModalSuccess
              successTitle={successTitle}
              successSubtitle={successSubtitle}
              successButtonLabel={successButtonLabel}
              close={fadeOut}
              review={submittedReview}
            />
          ) : (
            <ReviewModalForm
              {...formProps}
              onSubmit={handleSubmit}
              onCancel={fadeOut}
              product={product}
              loading={loading}
            />
          )}
        </>
      )}
    </UIModal>
  )
}

export default ReviewModal
