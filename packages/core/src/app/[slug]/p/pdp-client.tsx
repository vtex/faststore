'use client'

import type { ComponentType, ReactNode } from 'react'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
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

  const { offers, isValidating = false } = useOffer({
    skuId: serverData.data.product.id,
  })

  const clientOffer = offers as any
  const serverOffer = serverData.data.product.offers.offers[0]

  const data = {
    data: {
      isValidating,
      product: {
        ...serverData.data.product,
        offers: {
          ...serverData.data.product.offers,
          ...offers,
          offers: [
            {
              ...serverOffer,
              price: clientOffer?.lowPrice ?? serverOffer.price,
              priceWithTaxes:
                clientOffer?.lowPriceWithTaxes ?? serverOffer.priceWithTaxes,
            },
          ],
        },
      },
    },
  }

  console.log({
    offers,
    isValidating,
    serverData,
    data,
  })

  return <PageProvider context={data}>{children}</PageProvider>
}
