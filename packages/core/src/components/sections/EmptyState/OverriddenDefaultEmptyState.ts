import { override } from 'src/customizations/src/components/overrides/EmptyState'
import { getOverriddenSection } from 'src/sdk/overrides/getOverriddenSection'
import type { SectionOverrideDefinition } from 'src/typings/overridesDefinition'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default EmptyState section present in the Headless CMS
 */
export const OverriddenDefaultEmptyState = getOverriddenSection(
  override as SectionOverrideDefinition<'EmptyState'>
)
