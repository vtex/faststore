import { override } from '../../../customizations/src/components/overrides/Hero'
import { override as overridePlugin } from '../../../plugins/overrides/Hero'
import { getOverriddenSection } from '../../../sdk/overrides/getOverriddenSection'
import Hero from '.'

import type { SectionOverrideDefinitionV1 } from '../../../typings/overridesDefinition'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default Hero section present in the Headless CMS
 */
export const OverriddenDefaultHero = getOverriddenSection({
  ...(overridePlugin as SectionOverrideDefinitionV1<'Hero'>),
  ...(override as SectionOverrideDefinitionV1<'Hero'>),
  Section: Hero,
})
