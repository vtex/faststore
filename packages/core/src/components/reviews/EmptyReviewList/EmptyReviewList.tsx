import { Button as UIButton, Icon as UIIcon } from '@faststore/ui'
import type { HTMLAttributes } from 'react'

export interface EmptyReviewListProps extends HTMLAttributes<HTMLDivElement> {
  productId: string
  title?: string
  subtitle?: string
  buttonLabel?: string
  onButtonClick?: (productId: string) => void
}

function EmptyReviewList({
  productId,
  title = 'There are no reviews for this item yet',
  subtitle = 'Be the first one to do it',
  buttonLabel = 'Write the first review',
  onButtonClick,
  ...props
}: EmptyReviewListProps) {
  return (
    <div data-fs-empty-review-list {...props}>
      <div data-fs-empty-review-list-text>
        <UIIcon name="ChatDots" width={56} height={56} />
        <h5 data-fs-empty-review-list-title>{title}</h5>
        <p data-fs-empty-review-list-subtitle>{subtitle}</p>
      </div>
      <UIButton variant="primary" onClick={() => onButtonClick?.(productId)}>
        {buttonLabel}
      </UIButton>
    </div>
  )
}

export default EmptyReviewList
