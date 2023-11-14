import { Hero as UIHero, HeroImage as UIHeroImage } from '@faststore/ui'
import { getSectionOverrides } from 'src/sdk/overrides/overrides'
import { override } from 'src/customizations/src/components/overrides/Hero'
import type { SectionOverrideDefinition } from 'src/typings/overridesDefinition'
import CustomHeroHeader from './CustomHeroHeader'

const { Hero, HeroImage, HeroHeader } = getSectionOverrides(
  {
    Hero: UIHero,
    HeroImage: UIHeroImage,
    HeroHeader: CustomHeroHeader,
  },
  override as SectionOverrideDefinition<'Hero'>
)

export { Hero, HeroImage, HeroHeader }
