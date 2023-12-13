import Alert from '../../components/sections/Alert'
import BannerText from '../../components/sections/BannerText'
import Hero from '../../components/sections/Hero'
import ProductShelf from '../../components/sections/ProductShelf'

import type { DefaultSectionComponentsDefinitions } from '../../typings/overridesDefinition'
import type { SectionsOverrides } from '../../typings/overrides'
import { AlertDefaultComponents } from '../../components/sections/Alert/DefaultComponents'
import { BannerTextDefaultComponents } from '../../components/sections/BannerText/DefaultComponents'
import { HeroDefaultComponents } from '../../components/sections/Hero/DefaultComponents'
import { ProductShelfDefaultComponents } from '../../components/sections/ProductShelf/DefaultComponents'

export const Sections = {
  Alert,
  BannerText,
  Hero,
  ProductShelf,
}

export const DefaultComponents: Partial<
  Record<
    keyof SectionsOverrides,
    DefaultSectionComponentsDefinitions<keyof SectionsOverrides>
  >
> = {
  Alert: AlertDefaultComponents,
  BannerText: BannerTextDefaultComponents,
  Hero: HeroDefaultComponents,
  ProductShelf: ProductShelfDefaultComponents,
}
