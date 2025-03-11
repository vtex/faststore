import dynamic from 'next/dynamic'

const UIModalBody = dynamic(
  () =>
    import(/* webpackChunkName: "UIModalBody" */ '@faststore/ui').then(
      (mod) => mod.ModalBody
    ),
  { ssr: false }
)

const UIButton = dynamic(
  () =>
    import(/* webpackChunkName: "UIButton" */ '@faststore/ui').then(
      (mod) => mod.Button
    ),
  { ssr: false }
)

const UIIcon = dynamic(
  () =>
    import(/* webpackChunkName: "UIIcon" */ '@faststore/ui').then(
      (mod) => mod.Icon
    ),
  { ssr: false }
)

const UIReviewCard = dynamic(
  () =>
    import(/* webpackChunkName: "UIReviewCard" */ '@faststore/ui').then(
      (mod) => mod.ReviewCard
    ),
  { ssr: false }
)

// Add interface for form data
export interface ReviewModalSuccessProps {
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

function ReviewModalSuccess({
  successTitle = 'Success!',
  successSubtitle = 'Your review has been submitted.',
  successButtonLabel = 'Back to reviews',
  review,
  close,
}: ReviewModalSuccessProps) {
  return (
    <UIModalBody data-fs-review-modal-body data-fs-review-modal-step="success">
      <div data-fs-review-modal-success-feedback>
        <UIIcon name="Checked" height={32} width={32} />
        <h3>{successTitle}</h3>
        <p>{successSubtitle}</p>
      </div>

      <UIReviewCard {...review} />

      <UIButton type="button" onClick={close} variant="primary">
        {successButtonLabel}
      </UIButton>
    </UIModalBody>
  )
}

export default ReviewModalSuccess
