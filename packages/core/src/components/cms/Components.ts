import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

import Alert from 'src/components/sections/Alert'
import Hero from 'src/components/sections/Hero'
import Incentives from 'src/components/sections/Incentives'
import Navbar from 'src/components/sections/Navbar'
import RegionBar from 'src/components/sections/RegionBar'

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
      /* webpackChunkName: "BannerText" */ 'src/components/sections/BannerText'
    ),
  { ssr: false }
)
const Newsletter = dynamic(
  () =>
    import(
      /* webpackChunkName: "Newsletter" */ 'src/components/sections/Newsletter'
    ),
  { ssr: false }
)
const ProductShelf = dynamic(
  () =>
    import(
      /* webpackChunkName: "ProductShelf" */ 'src/components/sections/ProductShelf'
    ),
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
  Footer,
  Navbar,
  RegionBar,
  CartSidebar,
  RegionModal,
  BannerText,
  Hero,
  Incentives,
  Newsletter,
  ProductShelf,
  ProductTiles,
}

export default COMPONENTS
