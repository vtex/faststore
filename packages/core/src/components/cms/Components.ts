import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

import { OverriddenDefaultAlert as Alert } from 'src/components/sections/Alert/OverriddenDefaultAlert'
import { OverriddenDefaultHero as Hero } from 'src/components/sections/Hero/OverriddenDefaultHero'
import Incentives from 'src/components/sections/Incentives'
import { OverriddenDefaultNavbar as Navbar } from 'src/components/sections/Navbar/OverriddenDefaultNavbar'
import { OverriddenDefaultRegionBar as RegionBar } from 'src/components/sections/RegionBar/OverriddenDefaultRegionBar'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'

const Footer = dynamic(
  () =>
    import(/* webpackChunkName: "Footer" */ 'src/components/sections/Footer'),
  { ssr: false }
)
const CartSidebar = dynamic(
  () =>
    import(
      /* webpackChunkName: "CartSidebar" */ 'src/components/cart/CartSidebar'
    ),
  { ssr: false }
)
const RegionModal = dynamic(
  () =>
    import(
      /* webpackChunkName: "RegionModal" */ 'src/components/region/RegionModal'
    ),
  { ssr: false }
)
const BannerText = dynamic(
  () =>
    import(
      /* webpackChunkName: "BannerText" */ 'src/components/sections/BannerText/OverriddenDefaultBannerText'
    ).then((mod) => ({ default: mod.OverriddenDefaultBannerText })),
  { ssr: false }
)
const Newsletter = dynamic(
  () =>
    import(
      /* webpackChunkName: "Newsletter" */ 'src/components/sections/Newsletter/OverriddenDefaultNewsletter'
    ).then((mod) => ({ default: mod.OverriddenDefaultNewsletter })),
  { ssr: false }
)
const ProductShelf = dynamic(
  () =>
    import(
      /* webpackChunkName: "ProductShelf" */ 'src/components/sections/ProductShelf/OverriddenDefaultProductShelf'
    ).then((mod) => ({ default: mod.OverriddenDefaultProductShelf })),
  { ssr: false }
)
const ProductTiles = dynamic(
  () =>
    import(
      /* webpackChunkName: "ProductTiles" */ 'src/components/sections/ProductTiles'
    ),
  { ssr: false }
)

const COMPONENTS: Record<string, ComponentType<any>> = {
  Alert,
  Navbar,
  RegionBar,
  Hero,
  Incentives,
  BannerText,
  CartSidebar,
  RegionModal,
  Newsletter,
  ProductShelf,
  ProductTiles,
  Footer,
  ...CUSTOM_COMPONENTS,
}

export default COMPONENTS
