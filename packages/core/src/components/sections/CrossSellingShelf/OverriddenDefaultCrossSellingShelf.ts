import { getOverriddenSection } from 'app/sdk/overrides/getOverriddenSection'
import type { SectionOverrideDefinitionV1 } from 'app/typings/overridesDefinition'
import { override } from 'src/customizations/src/components/overrides/CrossSellingShelf'
import CrossSellingShelf from '.'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default CrossSellingShelf section present in the Headless CMS
 */
export const OverriddenDefaultCrossSellingShelf = getOverriddenSection({
  ...(override as SectionOverrideDefinitionV1<'CrossSellingShelf'>),
  Section: CrossSellingShelf,
})
