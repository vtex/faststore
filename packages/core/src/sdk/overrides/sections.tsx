import type { DefaultSectionComponentsDefinitions } from '../../typings/overridesDefinition'
import type { SectionsOverrides } from '../../typings/overrides'

export const Sections = {
  Alert: () => import('../../components/sections/Alert'),
  BannerText: () => import('../../components/sections/BannerText'),
  Breadcrumb: () => import('../../components/sections/Breadcrumb'),
  CrossSellingShelf: () =>
    import('../../components/sections/CrossSellingShelf'),
  Hero: () => import('../../components/sections/Hero'),
  ProductDetails: () => import('../../components/sections/ProductDetails'),
  ProductShelf: () => import('../../components/sections/ProductShelf'),
}

export const DefaultComponents: Partial<
  Record<
    keyof SectionsOverrides,
    DefaultSectionComponentsDefinitions<keyof SectionsOverrides>
  >
> = {
  Alert: {},
  BannerText: {},
  Breadcrumb: {},
  CrossSellingShelf: {},
  Hero: {},
  ProductDetails: {},
  ProductShelf: {},
}
