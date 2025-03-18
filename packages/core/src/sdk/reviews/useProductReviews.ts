import { useState, useCallback, useEffect } from 'react'
import type {
  ClientProductReviewsQuery,
  StoreProductListReviewsSort,
} from '@generated/graphql'
import { useProductReviewsQuery } from './useProductReviewsQuery'
import type { FilterProductListReview } from 'src/components/reviews/FilterProductReviews/FilterProductReviews'

type ProductReview = ClientProductReviewsQuery['reviews']['data'][number]

const PAGE_SIZE = 6

interface Props {
  productId: string
  initialSort?: StoreProductListReviewsSort
  initialRating?: number | null
}

export function useProductReviews({
  productId,
  initialSort = 'reviewDateTime_desc',
  initialRating = null,
}: Props) {
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState<StoreProductListReviewsSort>(initialSort)
  const [rating, setRating] = useState<number | null>(initialRating)
  const [reviews, setReviews] = useState<ProductReview[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)

  const handleFilterChange = useCallback((filter: FilterProductListReview) => {
    const newRating = Number(filter)
    setRating(newRating >= 1 && newRating <= 5 ? newRating : null)
    setPage(0)
    setReviews([])
  }, [])

  const handleSortChange = useCallback(
    (newSort: StoreProductListReviewsSort) => {
      setSort(newSort)
      setPage(0)
      setReviews([])
    },
    []
  )

  // Fetch reviews with the current filter, sort, and pagination
  const { data, isLoading, error } = useProductReviewsQuery({
    productId,
    first: PAGE_SIZE,
    after: page * PAGE_SIZE,
    sort,
    rating: rating || undefined,
  })

  const loadMore = useCallback(() => {
    if (isLoading) return
    setLoadingMore(true)
    setPage((prevPage) => prevPage + 1)
  }, [isLoading])

  const resetFilter = useCallback(() => {
    setPage(0)
    setRating(null)
  }, [])

  useEffect(() => {
    if (!data?.reviews) return

    // If it's the first page, replace reviews, otherwise append
    if (page === 0) {
      setReviews(data.reviews.data)
    } else {
      setLoadingMore(false)
      setReviews((prev) => [...prev, ...data.reviews.data])
    }

    // Update total count
    if (data.reviews.range) {
      setTotalCount(data.reviews.range.total)
    }
  }, [data, page])

  // Check if there are more reviews to load
  const hasMore = reviews.length < totalCount

  return {
    reviews,
    page,
    totalCount,
    loading: isLoading,
    loadingMore,
    hasMore,
    currentSort: sort,
    currentFilter: rating ? (String(rating) as FilterProductListReview) : 'all',
    loadMore,
    onSortChange: handleSortChange,
    onFilterChange: handleFilterChange,
    resetFilter,
  }
}
