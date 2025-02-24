import { RatingSummary } from '@faststore/ui'
import { usePDP } from 'src/sdk/overrides/PageProvider'
import useScreenResize from 'src/sdk/ui/useScreenResize'

export type ReviewsAndRatingsProps = {
  title: string
}

function ReviewsAndRatings({ title, ...otherProps }: ReviewsAndRatingsProps) {
  const context = usePDP()
  const { isDesktop } = useScreenResize()

  const rating = context?.data?.product?.rating

  return (
    rating && (
      <>
        <h2 className="text__title-section layout__content">{title}</h2>
        <div data-fs-content>
          {(isDesktop || rating?.totalCount > 0) && (
            <RatingSummary {...rating} {...otherProps} />
          )}
        </div>
      </>
    )
  )
}

export default ReviewsAndRatings
