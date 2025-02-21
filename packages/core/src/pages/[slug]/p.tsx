import { isNotFoundError } from '@faststore/api'
import type { Locator } from '@vtex/client-cms'
import deepmerge from 'deepmerge'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { BreadcrumbJsonLd, NextSeo, ProductJsonLd } from 'next-seo'
import Head from 'next/head'
import type { ComponentType } from 'react'

import { gql } from '@generated'
import type {
  ServerProductQueryQuery,
  ServerProductQueryQueryVariables,
} from '@generated/graphql'
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
import { execute } from 'src/server'

import storeConfig from 'discovery.config'
import {
  getGlobalSectionsData,
  type GlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import { getOfferUrl, useOffer } from 'src/sdk/offer'
import PageProvider, { type PDPContext } from 'src/sdk/overrides/PageProvider'
import { useProductQuery } from 'src/sdk/product/useProductQuery'
import { getPDP, type PDPContentType } from 'src/server/cms/pdp'
import { buildStoreUrl } from 'src/utils/buildStoreUrl'

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

type Props = PDPContentType & {
  data: ServerProductQueryQuery
  globalSections: GlobalSectionsData
  meta: {
    title: string
    description: string
    canonical: string
  }
}

// Array merging strategy from deepmerge that makes client arrays overwrite server array
// https://www.npmjs.com/package/deepmerge
const overwriteMerge = (_: any[], sourceArray: any[]) => sourceArray

const isClientOfferEnabled = (storeConfig as StoreConfig).experimental
  .enableClientOffer

function Page({
  data: server,
  sections,
  settings,
  globalSections,
  offers,
  meta,
  storeUrl,
}: Props) {
  const { product } = server
  const { currency } = useSession()
  const titleTemplate = storeConfig?.seo?.titleTemplate ?? ''

  let itemListElements = product.breadcrumbList.itemListElement ?? []
  if (itemListElements.length !== 0) {
    itemListElements = itemListElements.map(
      ({ item: pathname, name, position }) => {
        const pageUrl = storeUrl + pathname

        return { name, position, item: pageUrl }
      }
    )
  }

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
      <BreadcrumbJsonLd itemListElements={itemListElements} />
      <ProductJsonLd
        id={`${meta.canonical}${settings?.seo?.id ?? ''}`}
        mainEntityOfPage={`${meta.canonical}${settings?.seo?.mainEntityOfPage ?? ''}`}
        productName={product.name}
        description={product.description}
        brand={product.brand.name}
        sku={product.sku}
        gtin={product.gtin}
        releaseDate={product.releaseDate}
        images={product.image.map((img) => img.url)} // Somehow, Google does not understand this valid Schema.org schema, so we need to do conversions
        offers={offers}
        {...(itemListElements.length !== 0 && {
          category: itemListElements[0].name,
        })}
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

const query = gql(`
  query ServerProductQuery($locator: [IStoreSelectedFacet!]!) {
    ...ServerProduct
    product(locator: $locator) {
      id: productID

      seo {
        title
        description
        canonical
      }

      brand {
        name
      }

      sku
      gtin
      name
      description
      releaseDate

      breadcrumbList {
        itemListElement {
          item
          name
          position
        }
      }

      image {
        url
        alternateName
      }

      offers {
        lowPrice
        highPrice
        lowPriceWithTaxes
        priceCurrency
        offers {
          availability
          price
          priceValidUntil
          priceCurrency
          itemCondition
          seller {
            identifier
          }
        }
      }

      isVariantOf {
        productGroupID
      }

      ...ProductDetailsFragment_product
    }
  }
`)

export const getStaticProps: GetStaticProps<
  Props,
  { slug: string },
  Locator
> = async ({ params, previewData }) => {
  const slug = params?.slug ?? ''
  const [searchResult, globalSections] = await Promise.all([
    execute<ServerProductQueryQueryVariables, ServerProductQueryQuery>({
      variables: { locator: [{ key: 'slug', value: slug }] },
      operation: query,
    }),
    getGlobalSectionsData(previewData),
  ])

  const { data, errors = [] } = searchResult

  const notFound = errors.find(isNotFoundError)

  if (notFound) {
    return {
      notFound: true,
    }
  }

  if (errors.length > 0) {
    throw errors[0]
  }

  const cmsPage: PDPContentType = await getPDP(data.product, previewData)

  const { seo } = data.product
  const title = seo.title || storeConfig.seo.title
  const description = seo.description || storeConfig.seo.description
  const storeUrl = buildStoreUrl(
    storeConfig.storeUrl,
    (storeConfig.api as Record<string, any>).subDomainPrefix
  )
  const canonical = `${storeUrl}${seo.canonical}`

  const meta = { title, description, canonical }

  let offer = {}

  if (data.product.offers.offers.length > 0) {
    const { listPrice, ...offerData } = data.product.offers.offers[0]

    offer = offerData
  }

  const offers = {
    ...offer,
    priceCurrency: data.product.offers.priceCurrency,
    url: canonical,
  }

  return {
    props: {
      data,
      ...cmsPage,
      meta,
      offers,
      globalSections,
      key: seo.canonical,
      storeUrl,
    },
    revalidate: (storeConfig as StoreConfig).experimental.revalidate ?? false,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Page
