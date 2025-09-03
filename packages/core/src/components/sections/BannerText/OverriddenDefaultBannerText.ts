import { override } from '../../../customizations/src/components/overrides/BannerText'
import { override as overridePlugin } from '../../../plugins/overrides/BannerText'
import { getOverriddenSection } from '../../../sdk/overrides/getOverriddenSection'
import BannerText from '.'

import type { SectionOverrideDefinitionV1 } from '../../../typings/overridesDefinition'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default BannerText section present in the Headless CMS
 */
export const OverriddenDefaultBannerText = getOverriddenSection({
  ...(overridePlugin as SectionOverrideDefinitionV1<'BannerText'>),
  ...(override as SectionOverrideDefinitionV1<'BannerText'>),
  Section: BannerText,
})
