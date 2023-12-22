import { override } from 'src/customizations/src/components/overrides/BannerText'
import { getOverriddenSection } from 'src/sdk/overrides/getOverriddenSection'
import BannerText from '.'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default BannerText section present in the Headless CMS
 */
export const OverriddenDefaultBannerText = getOverriddenSection({
  ...override,
  Section: BannerText,
})
