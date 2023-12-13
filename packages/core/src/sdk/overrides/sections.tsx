import Alert from '../../components/sections/Alert'
import BannerText from '../../components/sections/BannerText'
import Hero from '../../components/sections/Hero'
import ProductShelf from '../../components/sections/ProductShelf'
import CrossSellingShelf from '../../components/sections/CrossSellingShelf'
import ProductDetails from '../../components/sections/ProductDetails'

import type { DefaultSectionComponentsDefinitions } from '../../typings/overridesDefinition'
import type { SectionsOverrides } from '../../typings/overrides'
import { AlertDefaultComponents } from '../../components/sections/Alert/DefaultComponents'
import { BannerTextDefaultComponents } from '../../components/sections/BannerText/DefaultComponents'
import { CrossSellingShelfDefaultComponents } from 'src/components/sections/CrossSellingShelf/DefaultComponents'
import { HeroDefaultComponents } from '../../components/sections/Hero/DefaultComponents'
import { ProductShelfDefaultComponents } from '../../components/sections/ProductShelf/DefaultComponents'
import { ProductDetailsDefaultComponents } from '../../components/sections/ProductDetails/DefaultComponents'

export const Sections = {
  Alert,
  BannerText,
  CrossSellingShelf,
  Hero,
  ProductShelf,
  ProductDetails,
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
  CrossSellingShelf: CrossSellingShelfDefaultComponents,
  ProductDetails: ProductDetailsDefaultComponents,
}
