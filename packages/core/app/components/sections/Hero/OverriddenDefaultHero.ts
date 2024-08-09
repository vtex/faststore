'use client'

import { override } from 'src/customizations/src/components/overrides/Hero'
import { getOverriddenSection } from 'src/sdk/overrides/getOverriddenSection'
import Hero from '.'

import type { SectionOverrideDefinitionV1 } from 'src/typings/overridesDefinition'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default Hero section present in the Headless CMS
 */
export const OverriddenDefaultHero = getOverriddenSection({
  ...(override as SectionOverrideDefinitionV1<'Hero'>),
  Section: Hero,
})
