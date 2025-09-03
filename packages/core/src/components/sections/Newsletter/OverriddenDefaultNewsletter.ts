import { override } from '../../../customizations/src/components/overrides/Newsletter'
import { override as overridePlugin } from '../../../plugins/overrides/Newsletter'
import { getOverriddenSection } from '../../../sdk/overrides/getOverriddenSection'
import type { SectionOverrideDefinitionV1 } from '../../../typings/overridesDefinition'
import Newsletter from './Newsletter'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default Newsletter section present in the Headless CMS
 */
export const OverriddenDefaultNewsletter = getOverriddenSection({
  ...(overridePlugin as SectionOverrideDefinitionV1<'Newsletter'>),
  ...(override as SectionOverrideDefinitionV1<'Newsletter'>),
  Section: Newsletter,
})
