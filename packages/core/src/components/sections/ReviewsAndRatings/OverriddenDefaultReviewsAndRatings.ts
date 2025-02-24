import { override } from 'src/customizations/src/components/overrides/ReviewsAndRatings'
import { override as overridePlugin } from 'src/plugins/overrides/ReviewsAndRatings'
import { getOverriddenSection } from 'src/sdk/overrides/getOverriddenSection'
import type { SectionOverrideDefinitionV1 } from 'src/typings/overridesDefinition'
import ReviewsAndRatings from '.'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default ReviewsAndRatings section present in the Headless CMS
 */
export const OverriddenDefaultReviewsAndRatings = getOverriddenSection({
  ...(overridePlugin as SectionOverrideDefinitionV1<'ReviewsAndRatings'>),
  ...(override as SectionOverrideDefinitionV1<'ReviewsAndRatings'>),
  Section: ReviewsAndRatings,
})
