import { getOverriddenSection } from 'src/sdk/overrides/getOverriddenSection'
import type { SectionOverrideDefinition } from 'src/typings/overridesDefinition'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default CrossSellingShelf section present in the Headless CMS
 */
export const OverriddenDefaultCrossSellingShelf = getOverriddenSection({
  section: 'CrossSellingShelf',
} as SectionOverrideDefinition<'CrossSellingShelf'>)
