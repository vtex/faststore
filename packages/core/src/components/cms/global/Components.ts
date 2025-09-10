import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

import RegionPopover from '../../region/RegionPopover'
import { OverriddenDefaultAlert as Alert } from '../../sections/Alert/OverriddenDefaultAlert'
import { OverriddenDefaultNavbar as Navbar } from '../../sections/Navbar/OverriddenDefaultNavbar'
import { OverriddenDefaultRegionBar as RegionBar } from '../../sections/RegionBar/OverriddenDefaultRegionBar'

import CUSTOM_COMPONENTS from '../../../customizations/src/components'
import PLUGINS_COMPONENTS from '../../../plugins'
import { getComponentKey } from '../../../utils/cms'

const CartSidebar = dynamic(
  () => import(/* webpackChunkName: "CartSidebar" */ '../../cart/CartSidebar'),
  { ssr: false }
)
const RegionModal = dynamic(
  () =>
    import(/* webpackChunkName: "RegionModal" */ '../../region/RegionModal'),
  { ssr: false }
)
const Footer = dynamic(
  () => import(/* webpackChunkName: "Footer" */ '../../sections/Footer'),
  { ssr: false }
)
const RegionSlider = dynamic(
  () =>
    import(/* webpackChunkName: "RegionSlider" */ '../../region/RegionSlider'),
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
