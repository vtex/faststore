import { getOverriddenSection } from 'src/sdk/overrides/getOverriddenSection'
import type { SectionOverrideDefinition } from 'src/typings/overridesDefinition'

export const OverriddenDefaultCrossSellingShelf = getOverriddenSection({
  section: 'CrossSellingShelf',
} as SectionOverrideDefinition<'CrossSellingShelf'>)
