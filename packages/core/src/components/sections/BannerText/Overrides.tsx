import {
  BannerText as UIBannerText,
  BannerTextContent as UIBannerTextContent,
} from '@faststore/ui'
import type { BannerTextContentProps, BannerTextProps } from '@faststore/ui'

import type {
  ComponentOverrideDefinition,
  SectionOverrideDefinition,
} from 'src/typings/overrides'
import { getSectionOverrides } from 'src/utils/overrides'
import { override } from 'src/customizations/components/overrides/BannerText'

export type BannerTextOverrideDefinition = SectionOverrideDefinition<
  'BannerText',
  {
    BannerText: ComponentOverrideDefinition<BannerTextProps, BannerTextProps>
    BannerTextContent: ComponentOverrideDefinition<
      BannerTextContentProps,
      BannerTextContentProps
    >
  }
>

const { BannerText, BannerTextContent } = getSectionOverrides(
  {
    BannerText: UIBannerText,
    BannerTextContent: UIBannerTextContent,
  },
  override as BannerTextOverrideDefinition
)

export { BannerText, BannerTextContent }
