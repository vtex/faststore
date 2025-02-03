import { useMemo } from 'react'

import ReviewAndRatings from '../../../components/ui/ReviewAndRatings'
import styles from '../ReviewAndRatings/section.module.scss'
import Section from '../Section'
import { ReviewAndRatingsDefaultComponents } from './DefaultComponents'
import { getOverridableSection } from '../../../sdk/overrides/getOverriddenSection'

interface Props {
  title: string
}
const ReviewAndRatingsSection = ({
  title,
}: Props) => {
  return (
    <Section
      id="review-and-ratings"
      className={`${styles.section} section-review-and-ratings layout__section`}
    >
      <ReviewAndRatings title={title}  />
    </Section>
  )
}

const OverridableReviewAndRatings = getOverridableSection<
  typeof ReviewAndRatingsSection
>(
  'ReviewAndRatings',
  ReviewAndRatingsSection,
  ReviewAndRatingsDefaultComponents
)

export default OverridableReviewAndRatings
