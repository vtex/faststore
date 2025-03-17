import { Button, Icon } from '@faststore/components'

export interface EmptyReviewListProps {
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
}: EmptyReviewListProps) {
  return (
    <div data-fs-empty-review-list>
      <div data-fs-empty-review-list-text>
        <Icon name="ChatDots" />
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
