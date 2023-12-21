import Alert from '../../components/sections/Alert'
import BannerText from '../../components/sections/BannerText'
import Breadcrumb from '../../components/sections/Breadcrumb'
import EmptyState from '../../components/sections/EmptyState'
import Hero from '../../components/sections/Hero'
import ProductShelf from '../../components/sections/ProductShelf'
import CrossSellingShelf from '../../components/sections/CrossSellingShelf'
import ProductDetails from '../../components/sections/ProductDetails'

import type { DefaultSectionComponentsDefinitions } from '../../typings/overridesDefinition'
import type { SectionsOverrides } from '../../typings/overrides'
import { AlertDefaultComponents } from '../../components/sections/Alert/DefaultComponents'
import { BannerTextDefaultComponents } from '../../components/sections/BannerText/DefaultComponents'
import { BreadcrumbDefaultComponents } from 'src/components/sections/Breadcrumb/DefaultComponents'
import { CrossSellingShelfDefaultComponents } from 'src/components/sections/CrossSellingShelf/DefaultComponents'
import { EmptyStateDefaultComponents } from 'src/components/sections/EmptyState/DefaultComponents'
import { HeroDefaultComponents } from '../../components/sections/Hero/DefaultComponents'
import { ProductShelfDefaultComponents } from '../../components/sections/ProductShelf/DefaultComponents'
import { ProductDetailsDefaultComponents } from '../../components/sections/ProductDetails/DefaultComponents'

export const Sections = {
  Alert,
  BannerText,
  Breadcrumb,
  CrossSellingShelf,
  EmptyState,
  Hero,
  ProductDetails,
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
  EmptyState: EmptyStateDefaultComponents,
  Hero: HeroDefaultComponents,
  ProductDetails: ProductDetailsDefaultComponents,
  ProductShelf: ProductShelfDefaultComponents,
}
