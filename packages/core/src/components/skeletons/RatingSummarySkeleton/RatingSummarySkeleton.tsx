import { Skeleton as UISkeleton } from '@faststore/ui'

function RatingSummarySkeleton() {
  return (
    <div data-fs-rating-summary>
      <div data-fs-rating-summary-header>
        <UISkeleton
          data-fs-rating-summary-header-average
          size={{
            height: '2rem',
            width: '2.75rem',
          }}
        />
        <UISkeleton
          size={{
            height: '1.2rem',
            width: '6rem',
          }}
        />
        <UISkeleton
          data-fs-rating-summary-header-total-count
          size={{
            height: '0.75rem',
            width: '3.75rem',
          }}
        />
      </div>

      <UISkeleton
        size={{
          height: '2.5rem',
          width: '8rem',
        }}
      />

      <div data-fs-rating-distribution>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} data-fs-distribution-item>
            <UISkeleton
              data-fs-rating-distribution-item-star
              size={{
                height: '1rem',
                width: '1rem',
              }}
            />
            <UISkeleton
              data-fs-rating-distribution-item-bar
              size={{
                height: '0.5rem',
                width: '100%',
              }}
            />
            <UISkeleton
              data-fs-rating-distribution-item-percentage
              size={{
                height: '1rem',
                width: '1rem',
              }}
              style={{
                justifySelf: 'end',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default RatingSummarySkeleton
