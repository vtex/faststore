import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

import RegionPopover from 'src/components/region/RegionPopover'
import { OverriddenDefaultAlert as Alert } from 'src/components/sections/Alert/OverriddenDefaultAlert'
import { OverriddenDefaultNavbar as Navbar } from 'src/components/sections/Navbar/OverriddenDefaultNavbar'
import { OverriddenDefaultRegionBar as RegionBar } from 'src/components/sections/RegionBar/OverriddenDefaultRegionBar'

import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import PLUGINS_COMPONENTS from 'src/plugins'

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
  RegionPopover,
  CartSidebar, // out of viewport
  RegionModal, // out of viewport
  Footer, // out of viewport
  ...PLUGINS_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

export default COMPONENTS
