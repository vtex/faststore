'use client'

import { useMemo, type ComponentType, type ReactNode } from 'react'
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
import { useOffer } from 'src/sdk/offer'
import PageProvider from 'src/sdk/overrides/PageProvider'
import deepmerge from 'deepmerge'

export const PDP_COMPONENTS: Record<string, ComponentType<any>> = {
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

interface PdpDataProps {
  serverData: any
  children: ReactNode
}

export function PdpData(props: PdpDataProps) {
  const { serverData, children } = props

  const { offers, isValidating } = useOffer({
    skuId: serverData.data.product.id,
  })

  console.log({
    offers,
    isValidating,
  })

  const clientData = {
    data: {
      product: {
        offers,
      },
      isValidating,
    },
  }

  const data = useMemo(
    () =>
      deepmerge(serverData, clientData, {
        arrayMerge: (_: any[], sourceArray: any[]) => sourceArray,
      }),
    [serverData, clientData]
  )

  return <PageProvider context={data}>{children}</PageProvider>
}
