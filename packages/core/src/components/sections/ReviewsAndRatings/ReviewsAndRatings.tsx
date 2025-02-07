import { useMemo } from 'react'

import ReviewsAndRatings from '../../ui/ReviewsAndRatings'
import styles from '../ReviewsAndRatings/section.module.scss'
import Section from '../Section'
import { ReviewsAndRatingsDefaultComponents } from './DefaultComponents'
import { getOverridableSection } from '../../../sdk/overrides/getOverriddenSection'

interface Props {
  title: string
}
const ReviewsAndRatingsSection = ({ title }: Props) => {
  return (
    <Section
      id="review-and-ratings"
      className={`${styles.section} section-review-and-ratings layout__section`}
    >
      <ReviewsAndRatings title={title} />
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
