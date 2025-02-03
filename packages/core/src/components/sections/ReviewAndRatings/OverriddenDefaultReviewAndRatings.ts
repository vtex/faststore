import { override } from 'src/customizations/src/components/overrides/ReviewAndRatings'
import { override as overridePlugin } from 'src/plugins/overrides/ReviewAndRatings'
import { getOverriddenSection } from 'src/sdk/overrides/getOverriddenSection'
import type { SectionOverrideDefinitionV1 } from 'src/typings/overridesDefinition'
import ReviewAndRatings from '.'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default ReviewAndRatings section present in the Headless CMS
 */
export const OverriddenDefaultReviewAndRatings = getOverriddenSection({
  ...(overridePlugin as SectionOverrideDefinitionV1<'ReviewAndRatings'>),
  ...(override as SectionOverrideDefinitionV1<'ReviewAndRatings'>),
  Section: ReviewAndRatings,
})
