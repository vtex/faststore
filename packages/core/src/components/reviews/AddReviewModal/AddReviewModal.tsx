import {
  type AddReviewModalProps as UIAddReviewModalProps,
  useUI,
} from '@faststore/ui'

import styles from './section.module.scss'

import dynamic from 'next/dynamic'
import type {
  AddReviewModalFormData,
  AddReviewModalFormProps,
} from './AddReviewModalForm'
import AddReviewModalForm from './AddReviewModalForm'
import { useCallback, useEffect, useState } from 'react'
import { useAddReview } from 'src/sdk/reviews/useAddReview'
import AddReviewModalSuccess, {
  type AddReviewModalSuccessProps,
} from './AddReviewModalSuccess'
import isUUID from 'src/utils/isUUID'

const UIAddReviewModal = dynamic(
  () =>
    import(/* webpackChunkName: "UIAddReviewModal" */ '@faststore/ui').then(
      (mod) => mod.AddReviewModal
    ),
  { ssr: false }
)

const UIIcon = dynamic(() => import('@faststore/ui').then((mod) => mod.Icon), {
  ssr: false,
})

export interface AddReviewModalProps
  extends Omit<AddReviewModalFormProps, 'onSubmit' | 'onCancel'>,
    AddReviewModalSuccessProps {
  title?: UIAddReviewModalProps['title']
  closeButtonAriaLabel?: UIAddReviewModalProps['closeButtonAriaLabel']
}

function AddReviewModal({
  title,
  closeButtonAriaLabel,
  product,
  successTitle,
  successSubtitle,
  successButtonLabel,
  ...formProps
}: AddReviewModalProps) {
  const { pushToast } = useUI()
  const { createProductReview, data, error, loading } = useAddReview()
  const [submittedReview, setSubmittedReview] =
    useState<AddReviewModalFormData | null>(null)
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
    (formData: AddReviewModalFormData) => {
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
    <UIAddReviewModal
      title={title}
      overlayProps={{
        className: `section ${styles.section} section-add-review-modal`,
      }}
      closeButtonAriaLabel={closeButtonAriaLabel}
    >
      {({ fadeOut }) => (
        <>
          {isSuccess ? (
            <AddReviewModalSuccess
              successTitle={successTitle}
              successSubtitle={successSubtitle}
              successButtonLabel={successButtonLabel}
              close={fadeOut}
              review={submittedReview}
            />
          ) : (
            <AddReviewModalForm
              {...formProps}
              onSubmit={handleSubmit}
              onCancel={fadeOut}
              product={product}
              loading={loading}
            />
          )}
        </>
      )}
    </UIAddReviewModal>
  )
}

export default AddReviewModal
