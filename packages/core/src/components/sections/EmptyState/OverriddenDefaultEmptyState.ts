import { override } from '../../../customizations/src/components/overrides/EmptyState'
import { override as overridePlugin } from '../../../plugins/overrides/EmptyState'
import { getOverriddenSection } from '../../../sdk/overrides/getOverriddenSection'

import type { SectionOverrideDefinitionV1 } from '../../../typings/overridesDefinition'
import EmptyState from './EmptyState'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default EmptyState section present in the Headless CMS
 */
export const OverriddenDefaultEmptyState = getOverriddenSection({
  ...(overridePlugin as SectionOverrideDefinitionV1<'EmptyState'>),
  ...(override as SectionOverrideDefinitionV1<'EmptyState'>),
  Section: EmptyState,
})
