import { usePDP } from 'src/sdk/overrides/PageProvider'
import useScreenResize from 'src/sdk/ui/useScreenResize'
import type { RatingSummaryProps } from '@faststore/ui'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import type { ReviewListProps } from 'src/components/reviews/ReviewList'

export type ReviewsAndRatingsProps = {
  title: string
  ratingSummary: {
    ratingCounter: RatingSummaryProps['textLabels']['ratingCounter']
    createReviewButton: RatingSummaryProps['textLabels']['createReviewButton']
  }
  reviewList: {
    filterSelect: ReviewListProps['filterSelect']
    sortSelect: ReviewListProps['sortSelect']
  }
}

function ReviewsAndRatings({
  title,
  reviewList,
  ratingSummary,
}: ReviewsAndRatingsProps) {
  const { RatingSummary, __experimentalReviewList: ReviewList } =
    useOverrideComponents<'ReviewsAndRatings'>()
  const context = usePDP()
  const { isDesktop } = useScreenResize()

  const rating = context?.data?.product?.rating

  return (
    rating && (
      <>
        <h2 className="text__title-section layout__content">{title}</h2>

        <div data-fs-content>
          {(isDesktop || rating?.totalCount > 0) && (
            <RatingSummary.Component
              {...RatingSummary.props}
              textLabels={{ ...ratingSummary }}
              // Dynamic props shouldn't be overridable
              // This decision can be reviewed later if needed
              {...rating}
              onCreateReviewClick={() => alert('Create review')}
            />
          )}

          <ReviewList.Component {...ReviewList.props} {...reviewList} />
        </div>
      </>
    )
  )
}

export default ReviewsAndRatings
