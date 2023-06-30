import {
  BannerText as UIBannerText,
  BannerTextContent as UIBannerTextContent,
} from '@faststore/ui'

import { getSectionOverrides } from 'src/utils/overrides'
import { override } from 'src/customizations/components/overrides/BannerText'
import type { BannerTextOverrideDefinition } from 'src/typings/overrides'

const { BannerText, BannerTextContent } = getSectionOverrides(
  {
    BannerText: UIBannerText,
    BannerTextContent: UIBannerTextContent,
  },
  override as BannerTextOverrideDefinition
)

export { BannerText, BannerTextContent }
