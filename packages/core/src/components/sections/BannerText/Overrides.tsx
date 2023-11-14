import { BannerText as UIBannerText } from '@faststore/ui'
import { getSectionOverrides } from 'src/sdk/overrides/overrides'
import { override } from 'src/customizations/src/components/overrides/BannerText'
import type { SectionOverrideDefinition } from 'src/typings/overridesDefinition'
import CustomBannerTextContent from './CustomBannerTextContent'

const { BannerText, BannerTextContent } = getSectionOverrides(
  {
    BannerText: UIBannerText,
    BannerTextContent: CustomBannerTextContent,
  },
  override as SectionOverrideDefinition<'BannerText'>
)

export { BannerText, BannerTextContent }
