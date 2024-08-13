import { getOverriddenSection } from 'app/sdk/overrides/getOverriddenSection'
import { override } from 'src/customizations/src/components/overrides/EmptyState'

import type { SectionOverrideDefinitionV1 } from 'app/typings/overridesDefinition'
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
