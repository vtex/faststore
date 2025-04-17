'use client'

import type { ComponentType } from 'react'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import RenderSections from 'src/components/cms/RenderSections'
import BannerNewsletter from 'src/components/sections/BannerNewsletter/BannerNewsletter'
import { OverriddenDefaultBannerText as BannerText } from 'src/components/sections/BannerText/OverriddenDefaultBannerText'
import { OverriddenDefaultBreadcrumb as Breadcrumb } from 'src/components/sections/Breadcrumb/OverriddenDefaultBreadcrumb'
import { OverriddenDefaultCrossSellingShelf as CrossSellingShelf } from 'src/components/sections/CrossSellingShelf/OverriddenDefaultCrossSellingShelf'
import { OverriddenDefaultHero as Hero } from 'src/components/sections/Hero/OverriddenDefaultHero'
import { OverriddenDefaultNewsletter as Newsletter } from 'src/components/sections/Newsletter/OverriddenDefaultNewsletter'
import { OverriddenDefaultProductDetails as ProductDetails } from 'src/components/sections/ProductDetails/OverriddenDefaultProductDetails'
import { OverriddenDefaultProductShelf as ProductShelf } from 'src/components/sections/ProductShelf/OverriddenDefaultProductShelf'
import ProductTiles from 'src/components/sections/ProductTiles'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import PLUGINS_COMPONENTS from 'src/plugins'
import PageProvider from 'src/sdk/overrides/PageProvider'

const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  Breadcrumb,
  BannerNewsletter,
  Newsletter,
  BannerText,
  Hero,
  ProductDetails,
  ProductShelf,
  ProductTiles,
  CrossSellingShelf,
  ...PLUGINS_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

export function PdpClient({ sections, context, globalSections }: any) {
  return (
    <PageProvider context={context}>
      <RenderSections
        sections={sections}
        globalSections={globalSections.sections}
        components={COMPONENTS}
      />
    </PageProvider>
  )
}
