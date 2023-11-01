import {
  BannerText as UIBannerText,
  BannerTextContent as UIBannerTextContent,
} from '@faststore/ui'

import { getSectionOverrides } from 'src/sdk/overrides/overrides'
import { override } from 'src/customizations/src/components/overrides/BannerText'
import type { SectionOverrideDefinition } from 'src/typings/overridesDefinition'

const { BannerText, BannerTextContent } = getSectionOverrides(
  {
    BannerText: UIBannerText,
    BannerTextContent: UIBannerTextContent,
  },
  override as SectionOverrideDefinition<'BannerText'>
)

export { BannerText, BannerTextContent }
