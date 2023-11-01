import {
  Hero as UIHero,
  HeroImage as UIHeroImage,
  HeroHeader as UIHeroHeader,
} from '@faststore/ui'

import { getSectionOverrides } from 'src/sdk/overrides/overrides'
import { override } from 'src/customizations/src/components/overrides/Hero'
import type { SectionOverrideDefinition } from 'src/typings/overridesDefinition'

const { Hero, HeroImage, HeroHeader } = getSectionOverrides(
  {
    Hero: UIHero,
    HeroImage: UIHeroImage,
    HeroHeader: UIHeroHeader,
  },
  override as SectionOverrideDefinition<'Hero'>
)

export { Hero, HeroImage, HeroHeader }
