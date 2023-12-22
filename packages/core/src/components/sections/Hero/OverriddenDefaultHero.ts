import { override } from 'src/customizations/src/components/overrides/Hero'
import { getOverriddenSection } from 'src/sdk/overrides/getOverriddenSection'
import type { SectionOverrideDefinition } from 'src/typings/overridesDefinition'
import Hero from '.'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default Hero section present in the Headless CMS
 */
export const OverriddenDefaultHero = getOverriddenSection({
  ...override,
  Section: Hero,
})
