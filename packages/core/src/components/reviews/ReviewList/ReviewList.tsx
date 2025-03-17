import { useUI } from '@faststore/components'
import type { FilterProductListReview } from '../FilterProductReviews'
import type { StoreProductListReviewsSort } from '@generated/graphql'
import { useProductReviews } from 'src/sdk/reviews/useProductReviews'
import dynamic from 'next/dynamic'

const UIReviewCard = dynamic(
  () =>
    import(/* webpackChunkName: "UIReviewCard" */ '@faststore/ui').then(
      (module) => module.ReviewCard
    ),
  { ssr: false }
)

const UIList = dynamic(
  () =>
    import(/* webpackChunkName: "UIList" */ '@faststore/ui').then(
      (module) => module.List
    ),
  { ssr: false }
)
const UIButton = dynamic(
  () =>
    import(/* webpackChunkName: "UIButton" */ '@faststore/ui').then(
      (module) => module.Button
    ),
  { ssr: false }
)

const ReviewCardSkeleton = dynamic(
  () =>
    import(
      /* webpackChunkName: "ReviewCardSkeleton" */ 'src/components/skeletons/ReviewCardSkeleton'
    ),
  { ssr: false }
)

const EmptyReviewList = dynamic(
  () =>
    import(
      /* webpackChunkName: "EmptyReviewList" */ 'src/components/reviews/EmptyReviewList'
    ),
  { ssr: false }
)
const SortProductReviews = dynamic(
  () =>
    import(
      /* webpackChunkName: "SortProductReviews" */ 'src/components/reviews/SortProductReviews'
    ),
  { ssr: false }
)
const FilterProductReviews = dynamic(
  () =>
    import(
      /* webpackChunkName: "FilterProductReviews" */ 'src/components/reviews/FilterProductReviews'
    ),
  { ssr: false }
)

export interface ReviewListProps {
  sortSelect?: {
    label: string
    options: Record<StoreProductListReviewsSort, string>
  }
  filterSelect?: {
    label: string
    options: Record<FilterProductListReview, string>
  }
  emptyList?: {
    title: string
    subtitle: string
    buttonLabel: string
  }
  emptyFilter?: {
    title: string
    subtitle: string
    buttonLabel: string
  }
  loadMoreLabel?: string
  productId: string
}

function ReviewList({
  sortSelect,
  filterSelect,
  emptyFilter,
  emptyList,
  productId,
  loadMoreLabel = 'Load more',
}: ReviewListProps) {
  const { openReviewModal } = useUI()
  const {
    reviews,
    loading,
    loadingMore,
    hasMore,
    currentSort,
    currentFilter,
    loadMore,
    onSortChange,
    onFilterChange,
    resetFilter,
  } = useProductReviews({
    productId: productId,
  })

  const isFirstLoading = loading && !loadingMore

  if (!loading && reviews.length <= 0 && currentFilter === 'all') {
    return (
      <EmptyReviewList
        productId={productId}
        onButtonClick={openReviewModal}
        title={emptyList?.title}
        subtitle={emptyList?.subtitle}
        buttonLabel={emptyList?.buttonLabel}
      />
    )
  }

  return (
    <div data-fs-review-list>
      <div data-fs-review-list-header>
        <SortProductReviews
          id="fs-sort-product-reviews-select"
          value={currentSort}
          label={sortSelect?.label}
          options={sortSelect?.options}
          onChange={onSortChange}
        />
        <FilterProductReviews
          id="fs-filter-product-reviews-select"
          value={currentFilter}
          label={filterSelect?.label}
          options={filterSelect?.options}
          onChange={onFilterChange}
        />
      </div>
      <div data-fs-review-list-content>
        <UIList className="review-list-items">
          {isFirstLoading ? (
            <ReviewCardSkeleton />
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <li key={review.id} className="review-list-item">
                <UIReviewCard
                  title={review.title}
                  text={review.text}
                  rating={review.rating}
                  author={review.reviewerName}
                  isVerified={review.verifiedPurchaser}
                  date={new Date(review.reviewDateTime)}
                />
              </li>
            ))
          ) : (
            <EmptyReviewList
              productId={productId}
              title={emptyFilter?.title}
              subtitle={emptyFilter?.subtitle}
              buttonLabel={emptyFilter?.buttonLabel}
              onButtonClick={resetFilter}
            />
          )}
        </UIList>
      </div>

      {hasMore && !isFirstLoading && (
        <UIButton
          data-fs-review-list-has-more
          onClick={loadMore}
          loading={loadingMore}
          variant="secondary"
        >
          {loadMoreLabel}
        </UIButton>
      )}
    </div>
  )
}

export default ReviewList
