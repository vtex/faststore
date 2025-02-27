import type {
  ButtonProps as UIButtonProps,
  AddReviewModalBodyProps as UIAddReviewModalBodyProps,
  ReviewCardProps as UIReviewCardProps,
  IconProps as UIIconProps,
} from '@faststore/ui'

import styles from './section.module.scss'

import dynamic from 'next/dynamic'

const UIAddReviewModalBody = dynamic<UIAddReviewModalBodyProps>(
  () =>
    import(/* webpackChunkName: "UIAddReviewModalBody" */ '@faststore/ui').then(
      (mod) => mod.AddReviewModalBody
    ),
  { ssr: false }
)

const UIButton = dynamic<UIButtonProps>(
  () =>
    import(/* webpackChunkName: "UIButton" */ '@faststore/ui').then(
      (mod) => mod.Button
    ),
  { ssr: false }
)

const UIIcon = dynamic<UIIconProps>(
  () =>
    import(/* webpackChunkName: "UIIcon" */ '@faststore/ui').then(
      (mod) => mod.Icon
    ),
  { ssr: false }
)

const UIReviewCard = dynamic<UIReviewCardProps>(
  () =>
    import(/* webpackChunkName: "UIReviewCard" */ '@faststore/ui').then(
      (mod) => mod.ReviewCard
    ),
  { ssr: false }
)

// Add interface for form data
export interface AddReviewModalSuccessProps {
  successTitle: string
  successSubtitle: string
  successButtonLabel: string
  close(): void
  review: {
    rating: number
    title: string
    text: string
  }
}

function AddReviewModalSuccess({
  successTitle,
  successSubtitle,
  successButtonLabel,
  review,
  close,
}: AddReviewModalSuccessProps) {
  return (
    <UIAddReviewModalBody
      className={`${styles.addReviewModalBody} ${styles.success}`}
    >
      <div className={styles.successFeedback}>
        <UIIcon name="Checked" height={32} width={32} />
        <h3>{successTitle}</h3>
        <p>{successSubtitle}</p>
      </div>

      <UIReviewCard {...review} />

      <UIButton type="button" onClick={close} variant="primary">
        {successButtonLabel}
      </UIButton>
    </UIAddReviewModalBody>
  )
}

export default AddReviewModalSuccess
