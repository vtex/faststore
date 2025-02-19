import { useMemo } from 'react'

import ReviewsAndRatings, {
  type ReviewsAndRatingsProps,
} from '../../ui/ReviewsAndRatings'
import styles from '../ReviewsAndRatings/section.module.scss'
import Section from '../Section'
import { ReviewsAndRatingsDefaultComponents } from './DefaultComponents'
import { getOverridableSection } from '../../../sdk/overrides/getOverriddenSection'

interface Props {
  title: ReviewsAndRatingsProps['title']
  addReviewModal: ReviewsAndRatingsProps['addReviewModal']
}
const ReviewsAndRatingsSection = ({ title, addReviewModal }: Props) => {
  return (
    <Section
      id="reviews-and-ratings"
      className={`${styles.section} section-reviews-and-ratings layout__section`}
    >
      <ReviewsAndRatings title={title} addReviewModal={addReviewModal} />
    </Section>
  )
}

const OverridableReviewsAndRatings = getOverridableSection<
  typeof ReviewsAndRatingsSection
>(
  'ReviewsAndRatings',
  ReviewsAndRatingsSection,
  ReviewsAndRatingsDefaultComponents
)

export default OverridableReviewsAndRatings
