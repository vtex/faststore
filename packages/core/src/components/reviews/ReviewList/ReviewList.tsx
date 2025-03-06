import { FilterProductReviews } from '../FilterProductReviews'
import { SortProductReviews } from '../SortProductReviews'
import type { StoreProductListReviewsSort } from '@generated/graphql'
import type { FilterProductListReview } from '../FilterProductReviews/FilterProductReviews'

export interface ReviewListProps {
  sortSelect?: {
    label: string
    options: Record<StoreProductListReviewsSort, string>
  }
  filterSelect?: {
    label: string
    options: Record<FilterProductListReview, string>
  }
  currentSort?: StoreProductListReviewsSort
  currentFilter?: FilterProductListReview
  onSortChange: (sort: StoreProductListReviewsSort) => void
  onFilterChange: (filter: FilterProductListReview) => void
}

function ReviewList({
  sortSelect,
  filterSelect,
  currentSort,
  currentFilter,
  onSortChange,
  onFilterChange,
}: ReviewListProps) {
  return (
    <div data-fs-review-list>
      <div data-fs-review-list-header>
        <SortProductReviews
          value={currentSort}
          label={sortSelect?.label}
          options={sortSelect?.options}
          onChange={onSortChange}
        />
        <FilterProductReviews
          value={currentFilter}
          label={filterSelect?.label}
          options={filterSelect?.options}
          onChange={onFilterChange}
        />
      </div>
      <div data-fs-review-list-content></div>
    </div>
  )
}

export default ReviewList
