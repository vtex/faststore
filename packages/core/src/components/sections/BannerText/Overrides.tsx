import {
  BannerText as UIBannerText,
  BannerTextContent as UIBannerTextContent,
} from '@faststore/ui'

import { getSectionOverrides } from 'src/utils/overrides'
import { override } from 'src/customizations/src/components/overrides/BannerText'
import type { SectionOverrideDefinition } from 'src/typings/overrides'

const { BannerText, BannerTextContent } = getSectionOverrides(
  {
    BannerText: UIBannerText,
    BannerTextContent: UIBannerTextContent,
  },
  override as SectionOverrideDefinition<'BannerText'>
)

export { BannerText, BannerTextContent }
