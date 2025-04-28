import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

import RegionPopover from 'src/components/region/RegionPopover'
import { OverriddenDefaultAlert as Alert } from 'src/components/sections/Alert/OverriddenDefaultAlert'
import { OverriddenDefaultNavbar as Navbar } from 'src/components/sections/Navbar/OverriddenDefaultNavbar'
import { OverriddenDefaultRegionBar as RegionBar } from 'src/components/sections/RegionBar/OverriddenDefaultRegionBar'

import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import PLUGINS_COMPONENTS from 'src/plugins'

import { getComponentKey } from '../RenderSections'

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
const RegionSlider = dynamic(
  () =>
    import(
      /* webpackChunkName: "RegionSlider" */ 'src/components/region/RegionSlider'
    ),
  { ssr: false }
)

const COMPONENTS: Record<string, ComponentType<any>> = {
  [getComponentKey(Alert, 'Alert')]: Alert,
  [getComponentKey(Navbar, 'Navbar')]: Navbar,
  [getComponentKey(RegionBar, 'RegionBar')]: RegionBar,
  [getComponentKey(RegionPopover, 'RegionPopover')]: RegionPopover,
  [getComponentKey(CartSidebar, 'CartSidebar')]: CartSidebar, // out of viewport
  [getComponentKey(RegionModal, 'RegionModal')]: RegionModal, // out of viewport
  [getComponentKey(RegionSlider, 'RegionSlider')]: RegionSlider, // out of viewport
  [getComponentKey(Footer, 'Footer')]: Footer, // out of viewport
  ...PLUGINS_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

export default COMPONENTS
