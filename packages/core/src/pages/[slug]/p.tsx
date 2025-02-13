import deepmerge from 'deepmerge'
import { BreadcrumbJsonLd, NextSeo, ProductJsonLd } from 'next-seo'
import Head from 'next/head'
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
import { useSession } from 'src/sdk/session'

import storeConfig from 'discovery.config'
import { getOfferUrl, useOffer } from 'src/sdk/offer'
import PageProvider, { type PDPContext } from 'src/sdk/overrides/PageProvider'
import { useProductQuery } from 'src/sdk/product/useProductQuery'

import {
  getStaticProps,
  getStaticPaths,
  type PDPProps,
} from 'src/experimental/pdpServerSideFunctions'

type StoreConfig = typeof storeConfig & {
  experimental: {
    revalidate?: number
    enableClientOffer?: boolean
  }
}

/**
 * Sections: Components imported from each store's custom components and '../components/sections' only.
 * Do not import or render components from any other folder in here.
 */
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

// Array merging strategy from deepmerge that makes client arrays overwrite server array
// https://www.npmjs.com/package/deepmerge
const overwriteMerge = (_: any[], sourceArray: any[]) => sourceArray

const isClientOfferEnabled = (storeConfig as StoreConfig).experimental
  .enableClientOffer

function Page({
  data: server,
  sections,
  globalSections,
  offers,
  meta,
}: PDPProps) {
  const { product } = server
  const { currency } = useSession()
  const titleTemplate = storeConfig?.seo?.titleTemplate ?? ''

  const { client, isValidating } = isClientOfferEnabled
    ? (() => {
        const offer = useOffer({ skuId: product.sku })
        return {
          client: { product: { offers: offer.offers } },
          isValidating: offer.isValidating,
        }
      })()
    : (() => {
        const productQuery = useProductQuery(product.id, {
          product: product,
        })
        return {
          client: productQuery.data,
          isValidating: productQuery.isValidating,
        }
      })()

  const context = {
    data: {
      ...deepmerge(server, client, { arrayMerge: overwriteMerge }),
      isValidating,
    },
  } as PDPContext

  return (
    <>
      <Head>
        <link
          rel="preload"
          href={getOfferUrl(product.sku)}
          as="fetch"
          crossOrigin="anonymous"
          fetchPriority="high"
        />
      </Head>
      {/* SEO */}
      <NextSeo
        title={meta.title}
        description={meta.description}
        canonical={meta.canonical}
        openGraph={{
          type: 'og:product',
          url: meta.canonical,
          title: meta.title,
          description: meta.description,
          images: product.image.map((img) => ({
            url: img.url,
            alt: img.alternateName,
          })),
        }}
        additionalMetaTags={[
          {
            property: 'product:price:amount',
            content: product.offers.lowPrice?.toString() ?? undefined,
          },
          {
            property: 'product:price:currency',
            content: currency.code,
          },
        ]}
        titleTemplate={titleTemplate}
      />
      <BreadcrumbJsonLd
        itemListElements={product.breadcrumbList.itemListElement}
      />
      <ProductJsonLd
        productName={product.name}
        description={product.description}
        brand={product.brand.name}
        sku={product.sku}
        gtin={product.gtin}
        releaseDate={product.releaseDate}
        images={product.image.map((img) => img.url)} // Somehow, Google does not understand this valid Schema.org schema, so we need to do conversions
        offers={offers}
      />

      {/*
        WARNING: Do not import or render components from any
        other folder than '../components/sections' in here.

        This is necessary to keep the integration with the CMS
        easy and consistent, enabling the change and reorder
        of elements on this page.

        If needed, wrap your component in a <Section /> component
        (not the HTML tag) before rendering it here.
      */}
      <PageProvider context={context}>
        <RenderSections
          sections={sections}
          globalSections={globalSections.sections}
          components={COMPONENTS}
        />
      </PageProvider>
    </>
  )
}

export { getStaticProps, getStaticPaths }

export default Page
