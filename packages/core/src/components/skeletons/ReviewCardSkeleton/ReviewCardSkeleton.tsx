import { Skeleton as UISkeleton } from '@faststore/ui'

const ReviewCardSkeleton = () => {
  return (
    <div data-fs-review-card data-fs-review-card-skeleton>
      <div data-fs-review-card-header>
        <UISkeleton size={{ width: '80px', height: '20px' }} border="pill" />
        <UISkeleton
          size={{ width: '100px', height: '16px' }}
          border="pill"
          data-fs-review-card-author="desktop"
        />
        <UISkeleton
          size={{ width: '80px', height: '16px' }}
          data-fs-review-card-date="mobile"
        />
      </div>

      <div data-fs-review-card-text>
        <div data-fs-review-card-text-header>
          <UISkeleton size={{ width: '60%', height: '24px' }} />
          <UISkeleton
            size={{ width: '80px', height: '16px' }}
            data-fs-review-card-date="desktop"
          />
        </div>

        <div
          data-fs-review-card-text-content
          style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
        >
          <UISkeleton
            size={{ width: '100%', height: '16px' }}
            shimmer={false}
          />
          <UISkeleton size={{ width: '95%', height: '16px' }} shimmer={false} />
          <UISkeleton size={{ width: '90%', height: '16px' }} shimmer={false} />
        </div>
      </div>

      <UISkeleton
        size={{ width: '100px', height: '16px' }}
        border="pill"
        data-fs-review-card-author="mobile"
      />
    </div>
  )
}

export default ReviewCardSkeleton
