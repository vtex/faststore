import { override } from 'src/customizations/src/components/overrides/EmptyState'
import { getOverriddenSection } from 'src/sdk/overrides/getOverriddenSection'

import type { SectionOverrideDefinitionV1 } from 'src/typings/overridesDefinition'
import EmptyState from './EmptyState'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default EmptyState section present in the Headless CMS
 */
export const OverriddenDefaultEmptyState = getOverriddenSection({
  ...(override as SectionOverrideDefinitionV1<'EmptyState'>),
  Section: EmptyState,
})
