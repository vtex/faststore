import { override } from 'src/customizations/src/components/overrides/Alert'
import { getOverriddenSection } from 'src/sdk/overrides/getOverriddenSection'
import type { SectionOverrideDefinition } from 'src/typings/overridesDefinition'

export const OverriddenDefaultAlert = getOverriddenSection(
  override as SectionOverrideDefinition<'Alert'>
)
