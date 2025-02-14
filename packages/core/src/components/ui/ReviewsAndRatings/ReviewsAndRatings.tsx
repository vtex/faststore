export type ReviewsAndRatingsProps = {
  title: string
}

function ReviewsAndRatings({ title, ...otherProps }: ReviewsAndRatingsProps) {
  return (
    <>
      <h2 className="text__title-section layout__content">{title}</h2>
    </>
  )
}

export default ReviewsAndRatings
