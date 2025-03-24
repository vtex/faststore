import { Button, Icon } from '@faststore/components'
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
  title = 'This item does not have any reviews yet',
  subtitle = 'Be the first one to do it',
  buttonLabel = 'Write the first review',
  onButtonClick,
  ...props
}: EmptyReviewListProps) {
  return (
    <div data-fs-empty-review-list {...props}>
      <div data-fs-empty-review-list-text>
        <Icon name="ChatDots" width={56} height={56} />
        <h5 data-fs-empty-review-list-title>{title}</h5>
        <p data-fs-empty-review-list-subtitle>{subtitle}</p>
      </div>
      <Button
        data-fs-empty-review-list-write-review-button
        variant="primary"
        onClick={() => onButtonClick?.(productId)}
      >
        {buttonLabel}
      </Button>
    </div>
  )
}

export default EmptyReviewList
