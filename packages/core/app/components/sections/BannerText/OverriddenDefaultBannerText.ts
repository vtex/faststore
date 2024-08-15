'use client'

import { getOverriddenSection } from 'app/sdk/overrides/getOverriddenSection'
import { override } from 'src/customizations/src/components/overrides/BannerText'
import BannerText from '.'

import type { SectionOverrideDefinitionV1 } from 'app/typings/overridesDefinition'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default BannerText section present in the Headless CMS
 */
export const OverriddenDefaultBannerText = getOverriddenSection({
  ...(override as SectionOverrideDefinitionV1<'BannerText'>),
  Section: BannerText,
})
