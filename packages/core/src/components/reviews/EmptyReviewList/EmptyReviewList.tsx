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
        {/* TODO: Replace this SVG with the corresponding icon from the new library when it's available */}
        <svg
          width="57"
          height="56"
          viewBox="0 0 57 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.2114 25.6667C19.8725 25.6667 20.4267 25.4431 20.8739 24.9959C21.3211 24.5487 21.5448 23.9945 21.5448 23.3334C21.5448 22.6723 21.3211 22.1181 20.8739 21.6709C20.4267 21.2237 19.8725 21.0001 19.2114 21.0001C18.5503 21.0001 17.9961 21.2237 17.5489 21.6709C17.1017 22.1181 16.8781 22.6723 16.8781 23.3334C16.8781 23.9945 17.1017 24.5487 17.5489 24.9959C17.9961 25.4431 18.5503 25.6667 19.2114 25.6667ZM28.5448 25.6667C29.2059 25.6667 29.76 25.4431 30.2073 24.9959C30.6545 24.5487 30.8781 23.9945 30.8781 23.3334C30.8781 22.6723 30.6545 22.1181 30.2073 21.6709C29.76 21.2237 29.2059 21.0001 28.5448 21.0001C27.8836 21.0001 27.3295 21.2237 26.8823 21.6709C26.435 22.1181 26.2114 22.6723 26.2114 23.3334C26.2114 23.9945 26.435 24.5487 26.8823 24.9959C27.3295 25.4431 27.8836 25.6667 28.5448 25.6667ZM37.8781 25.6667C38.5392 25.6667 39.0934 25.4431 39.5406 24.9959C39.9878 24.5487 40.2114 23.9945 40.2114 23.3334C40.2114 22.6723 39.9878 22.1181 39.5406 21.6709C39.0934 21.2237 38.5392 21.0001 37.8781 21.0001C37.217 21.0001 36.6628 21.2237 36.2156 21.6709C35.7684 22.1181 35.5448 22.6723 35.5448 23.3334C35.5448 23.9945 35.7684 24.5487 36.2156 24.9959C36.6628 25.4431 37.217 25.6667 37.8781 25.6667ZM5.21143 51.3334V9.33341C5.21143 8.05008 5.66837 6.95147 6.58226 6.03758C7.49615 5.12369 8.59476 4.66675 9.87809 4.66675H47.2114C48.4948 4.66675 49.5934 5.12369 50.5073 6.03758C51.4211 6.95147 51.8781 8.05008 51.8781 9.33341V37.3334C51.8781 38.6167 51.4211 39.7154 50.5073 40.6292C49.5934 41.5431 48.4948 42.0001 47.2114 42.0001H14.5448L5.21143 51.3334ZM12.5614 37.3334H47.2114V9.33341H9.87809V39.9584L12.5614 37.3334Z"
            fill="#D6D6D6"
          />
        </svg>
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
