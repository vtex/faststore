import {
  Hero as UIHero,
  HeroImage as UIHeroImage,
  HeroHeader as UIHeroHeader,
} from '@faststore/ui'
import type { HeroProps, HeroImageProps, HeroHeaderProps } from '@faststore/ui'

import type {
  ComponentOverrideDefinition,
  SectionOverrideDefinition,
} from 'src/typings/overrides'
import { getSectionOverrides } from 'src/utils/overrides'
import { override } from 'src/customizations/components/overrides/Hero'

export type HeroOverrideDefinition = SectionOverrideDefinition<
  'Hero',
  {
    Hero: ComponentOverrideDefinition<HeroProps, HeroProps>
    HeroImage: ComponentOverrideDefinition<HeroImageProps, HeroImageProps>
    HeroHeader: ComponentOverrideDefinition<HeroHeaderProps, HeroHeaderProps>
  }
>

const { Hero, HeroImage, HeroHeader } = getSectionOverrides(
  {
    Hero: UIHero,
    HeroImage: UIHeroImage,
    HeroHeader: UIHeroHeader,
  },
  override as HeroOverrideDefinition
)

export { Hero, HeroImage, HeroHeader }
