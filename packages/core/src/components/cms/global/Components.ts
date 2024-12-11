import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

import { OverriddenDefaultAlert as Alert } from 'src/components/sections/Alert/OverriddenDefaultAlert'
import { OverriddenDefaultNavbar as Navbar } from 'src/components/sections/Navbar/OverriddenDefaultNavbar'
import { OverriddenDefaultRegionBar as RegionBar } from 'src/components/sections/RegionBar/OverriddenDefaultRegionBar'

import CUSTOM_COMPONENTS from 'src/customizations/src/components'

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
const Footer = dynamic(
  () =>
    import(/* webpackChunkName: "Footer" */ 'src/components/sections/Footer'),
  { ssr: false }
)

const COMPONENTS: Record<string, ComponentType<any>> = {
  Alert,
  Navbar,
  RegionBar,
  CartSidebar, // out of viewport
  RegionModal, // out of viewport
  Footer, // out of viewport
  ...CUSTOM_COMPONENTS,
}

export default COMPONENTS
