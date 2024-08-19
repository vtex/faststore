import { override } from 'src/customizations/src/components/overrides/Newsletter'
import { getOverriddenSection } from 'src/sdk/overrides/getOverriddenSection'
import type { SectionOverrideDefinitionV1 } from 'src/typings/overridesDefinition'
import Newsletter from './Newsletter'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default Newsletter section present in the Headless CMS
 */
export const OverriddenDefaultNewsletter = getOverriddenSection({
  ...(override as SectionOverrideDefinitionV1<'Newsletter'>),
  Section: Newsletter,
})
