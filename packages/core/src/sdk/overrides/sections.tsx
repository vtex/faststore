import Alert from '../../components/sections/Alert'
import Hero from '../../components/sections/Hero'
import BannerText from '../../components/sections/BannerText'

import type { DefaultSectionComponentsDefinitions } from '../../typings/overridesDefinition'
import type { SectionsOverrides } from '../../typings/overrides'
import { AlertDefaultComponents } from '../../components/sections/Alert/DefaultComponents'
import { HeroDefaultComponents } from '../../components/sections/Hero/DefaultComponents'
import { BannerTextDefaultComponents } from '../../components/sections/BannerText/DefaultComponents'

export const Sections = {
  Alert,
  Hero,
  BannerText,
}

export const DefaultComponents: Partial<
  Record<
    keyof SectionsOverrides,
    DefaultSectionComponentsDefinitions<keyof SectionsOverrides>
  >
> = {
  Alert: AlertDefaultComponents,
  Hero: HeroDefaultComponents,
  BannerText: BannerTextDefaultComponents,
}
