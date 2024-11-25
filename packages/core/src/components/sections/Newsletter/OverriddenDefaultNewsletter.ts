import { override } from 'src/customizations/src/components/overrides/Newsletter'
import { override as overridePlugin } from 'src/plugins/overrides/Newsletter'
import { getOverriddenSection } from 'src/sdk/overrides/getOverriddenSection'
import type { SectionOverrideDefinitionV1 } from 'src/typings/overridesDefinition'
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
