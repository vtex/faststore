export type ReviewAndRatingsProps = {
  title: string
}

function ReviewAndRatings({
  title,
  ...otherProps
}: ReviewAndRatingsProps) {

  return (
    <>
      <h2 className="text__title-section layout__content">{title}</h2>
    </>
  )
}

export default ReviewAndRatings
