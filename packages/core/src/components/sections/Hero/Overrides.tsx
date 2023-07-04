import {
  Hero as UIHero,
  HeroImage as UIHeroImage,
  HeroHeader as UIHeroHeader,
} from '@faststore/ui'

import { getSectionOverrides } from 'src/utils/overrides'
import { override } from 'src/customizations/components/overrides/Hero'
import type { HeroOverrideDefinition } from 'src/typings/overrides'

const { Hero, HeroImage, HeroHeader } = getSectionOverrides(
  {
    Hero: UIHero,
    HeroImage: UIHeroImage,
    HeroHeader: UIHeroHeader,
  },
  override as HeroOverrideDefinition
)

export { Hero, HeroImage, HeroHeader }
