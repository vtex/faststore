import { Section } from '@vtex/client-cms'
import type { ComponentType } from 'react'
import { PropsWithChildren, lazy } from 'react'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'

import RenderSections from './RenderSections'

import { OverriddenDefaultAlert as Alert } from 'app/components/sections/Alert/OverriddenDefaultAlert'
import { OverriddenDefaultNavbar as Navbar } from 'app/components/sections/Navbar/OverriddenDefaultNavbar'
const Toast = lazy(() => import('app/components/common/Toast'))

// import Footer from 'src/components/sections/Footer'
// import { OverriddenDefaultRegionBar as RegionBar } from 'src/components/sections/RegionBar/OverriddenDefaultRegionBar'

// const RegionModal = lazy(() => import('src/components/region/RegionModal'))
// const CartSidebar = lazy(() => import('src/components/cart/CartSidebar'))
import Footer from 'app/components/sections/Footer'

export const GLOBAL_SECTIONS_CONTENT_TYPE = 'globalSections'

export type GlobalSectionsData = {
  sections: Section[]
}

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  Alert,
  Navbar,
  // RegionBar,
  // RegionModal,
  // CartSidebar,
  Footer,
  ...CUSTOM_COMPONENTS,
}

function GlobalSections({
  children,
  ...otherProps
}: PropsWithChildren<GlobalSectionsData>) {
  return (
    <RenderSections components={COMPONENTS} {...otherProps}>
      <Toast />

      <main>{children}</main>
    </RenderSections>
  )
}

export default GlobalSections
