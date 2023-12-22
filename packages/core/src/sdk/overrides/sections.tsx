import Alert from '../../components/sections/Alert'
import BannerText from '../../components/sections/BannerText'
import Breadcrumb from '../../components/sections/Breadcrumb'
import Hero from '../../components/sections/Hero'
import ProductShelf from '../../components/sections/ProductShelf'
import CrossSellingShelf from '../../components/sections/CrossSellingShelf'
import ProductDetails from '../../components/sections/ProductDetails'
import ProductGallery from '../../components/sections/ProductGallery'

import type { DefaultSectionComponentsDefinitions } from '../../typings/overridesDefinition'
import type { SectionsOverrides } from '../../typings/overrides'
import { AlertDefaultComponents } from '../../components/sections/Alert/DefaultComponents'
import { BannerTextDefaultComponents } from '../../components/sections/BannerText/DefaultComponents'
import { BreadcrumbDefaultComponents } from 'src/components/sections/Breadcrumb/DefaultComponents'
import { CrossSellingShelfDefaultComponents } from 'src/components/sections/CrossSellingShelf/DefaultComponents'
import { HeroDefaultComponents } from '../../components/sections/Hero/DefaultComponents'
import { ProductDetailsDefaultComponents } from '../../components/sections/ProductDetails/DefaultComponents'
import { ProductGalleryDefaultComponents } from '../../components/sections/ProductGallery/DefaultComponents'
import { ProductShelfDefaultComponents } from '../../components/sections/ProductShelf/DefaultComponents'

export const Sections = {
  Alert,
  BannerText,
  Breadcrumb,
  CrossSellingShelf,
  Hero,
  ProductDetails,
  ProductGallery,
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
  Breadcrumb: BreadcrumbDefaultComponents,
  CrossSellingShelf: CrossSellingShelfDefaultComponents,
  Hero: HeroDefaultComponents,
  ProductDetails: ProductDetailsDefaultComponents,
  ProductGallery: ProductGalleryDefaultComponents,
  ProductShelf: ProductShelfDefaultComponents,
}
