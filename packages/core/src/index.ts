import Alert from './components/sections/Alert'
import { getOverriddenSection } from './sdk/overrides/getOverriddenSection'

export {
  usePage,
  usePDP,
  usePLP,
  useSearchPage,
  isPDP,
  isPLP,
  isSearchPage,
} from './sdk/overrides/PageProvider'

export type {
  PDPContext,
  PLPContext,
  SearchPageContext,
} from './sdk/overrides/PageProvider'

export { useProductsQuery } from './sdk/product/useProductsQuery'

export * from './typings/overrides'
export { getOverriddenSection } from './sdk/overrides/getOverriddenSection'

// Overridable Sections
export { default as Alert } from './components/sections/Alert'
export { default as BannerText } from './components/sections/BannerText'
export { default as Breadcrumb } from './components/sections/Breadcrumb'
export { default as CrossSellingShelf } from './components/sections/CrossSellingShelf'
export { default as Hero } from './components/sections/Hero'
export { default as ProductDetails } from './components/sections/ProductDetails'
export { default as ProductShelf } from './components/sections/ProductShelf'
