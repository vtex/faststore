import {
  Banner as UIBanner,
  BannerContent as UIBannerContent,
} from '@faststore/ui'
import type { BannerContentProps, BannerProps } from '@faststore/ui'

import type {
  ComponentOverrideDefinition,
  SectionOverrideDefinition,
} from 'src/typings/overrides'
import { getSectionOverrides } from 'src/utils/overrides'
import { override } from 'src/customizations/components/overrides/BannerText'

export type BannerOverrideDefinition = SectionOverrideDefinition<
  'BannerText',
  {
    Banner: ComponentOverrideDefinition<BannerProps, BannerProps>
    BannerContent: ComponentOverrideDefinition<
      BannerContentProps,
      BannerContentProps
    >
  }
>

const { Banner, BannerContent } = getSectionOverrides(
  {
    Banner: UIBanner,
    BannerContent: UIBannerContent,
  },
  override as BannerOverrideDefinition
)

export { Banner, BannerContent }
