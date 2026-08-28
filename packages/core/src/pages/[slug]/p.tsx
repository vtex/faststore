import { isNotFoundError } from '@faststore/api'
import deepmerge from 'deepmerge'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { BreadcrumbJsonLd, NextSeo, ProductJsonLd } from 'next-seo'
import Head from 'next/head'
import { useRouter } from 'next/router'
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
import { getRedirect } from 'src/sdk/redirects'
import { useSession } from 'src/sdk/session'
import { execute } from 'src/server'
import { getComponentKey } from 'src/utils/cms'
import { getChannelForLocale } from 'src/utils/localization/bindingPaths'
import { buildHreflangLinks } from 'src/utils/localization/hreflang'
import { toProductJsonLdOffer } from 'src/utils/productJsonLd'

import storeConfig from 'discovery.config'
import {
  getGlobalSectionsData,
  type GlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import { LocalizedProductProvider } from 'src/sdk/localization/LocalizedProductContext'
import { getStoreURL } from 'src/sdk/localization/useLocalizationConfig'
import { getOfferUrl, useOffer } from 'src/sdk/offer'
import PageProvider, { type PDPContext } from 'src/sdk/overrides/PageProvider'
import { useProductQuery } from 'src/sdk/product/useProductQuery'
import { injectGlobalSections } from 'src/server/cms/global'
import type { PDPContentType } from 'src/server/cms/pdp'
import { contentService } from 'src/server/content/service'
import type { PreviewData } from 'src/server/content/types'

type StoreConfig = typeof storeConfig & {
  experimental: {
    revalidate?: number
    revalidate404?: number
    enableClientOffer?: boolean
  }
}

/**
 * Sections: Components imported from each store's custom components and '../components/sections' only.
 * Do not import or render components from any other folder in here.
 */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  [getComponentKey(Breadcrumb, 'Breadcrumb')]: Breadcrumb,
  [getComponentKey(BannerNewsletter, 'BannerNewsletter')]: BannerNewsletter,
  [getComponentKey(Newsletter, 'Newsletter')]: Newsletter,
  [getComponentKey(BannerText, 'BannerText')]: BannerText,
  [getComponentKey(Hero, 'Hero')]: Hero,
  [getComponentKey(ProductDetails, 'ProductDetails')]: ProductDetails,
  [getComponentKey(ProductShelf, 'ProductShelf')]: ProductShelf,
  [getComponentKey(ProductTiles, 'ProductTiles')]: ProductTiles,
  [getComponentKey(CrossSellingShelf, 'CrossSellingShelf')]: CrossSellingShelf,
  ...PLUGINS_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

// Maps schema.org `itemCondition` URLs to the values accepted by the
// Open Graph `product:condition` meta tag (`new` | `refurbished` | `used`).
const OG_PRODUCT_CONDITION_BY_SCHEMA: Record<string, string> = {
  'https://schema.org/NewCondition': 'new',
  'https://schema.org/RefurbishedCondition': 'refurbished',
  'https://schema.org/UsedCondition': 'used',
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

// With client-side offer enabled, `useOffer` only refreshes price aggregates —
// it does not rebuild the per-seller array the buy button reads. Keep that array
// from SSG, but inject the fresh Pricing Fallback token into the best offer so the
// value sent to the cart respects the token's short validity window.
const withFreshPriceToken = (
  serverOffers: ServerProductQueryQuery['product']['offers'],
  offer: ReturnType<typeof useOffer>
) => ({
  ...offer.offers,
  offers: serverOffers.offers.map((offerItem, index) =>
    index === 0
      ? { ...offerItem, priceToken: offer.priceToken ?? offerItem.priceToken }
      : offerItem
  ),
})

function Page({
  data: server,
  sections,
  settings,
  globalSections: globalSectionsProp,
  offers,
  meta,
}: Props) {
  const { currency } = useSession()
  const router = useRouter()

  const { product } = server
  const {
    seo: { pdp: pdpSeo, ...storeSeo },
  } = storeConfig

  // SEO data
  const title = meta?.title ?? storeSeo.title
  const titleTemplate =
    settings?.seo?.titleTemplate ??
    pdpSeo?.titleTemplate ??
    storeSeo.titleTemplate
  const description =
    meta?.description ||
    pdpSeo.descriptionTemplate.replace(/%s/g, () => title) ||
    storeSeo.description
  let productPriceAmountMetatag = product.offers.lowPrice?.toString()

  if (
    product.offers.lowPrice != undefined &&
    pdpSeo?.minPriceAmountFractionDigits &&
    typeof pdpSeo.minPriceAmountFractionDigits === 'number'
  ) {
    productPriceAmountMetatag = product.offers.lowPrice
      .toFixed(pdpSeo.minPriceAmountFractionDigits)
      .toString()
  }

  const productCondition =
    OG_PRODUCT_CONDITION_BY_SCHEMA[
      product.offers.offers[0]?.itemCondition ?? ''
    ]

  // hreflang alternate links for multi-locale stores
  const hreflangLinks = buildHreflangLinks(server.product.otherLocales, '/p')

  let itemListElements = product.breadcrumbList.itemListElement ?? []
  if (itemListElements.length !== 0) {
    itemListElements = itemListElements.map(
      ({ item: pathname, name, position }) => {
        const pageUrl = getStoreURL(router.locale) + pathname

        return { name, position, item: pageUrl }
      }
    )
  }

  const { client, isValidating } = isClientOfferEnabled
    ? (() => {
        const offer = useOffer({ skuId: product.sku })
        return {
          client: {
            product: {
              offers: withFreshPriceToken(product.offers, offer),
            },
          },
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

  const { sections: globalSections, settings: globalSettings } =
    globalSectionsProp ?? {}
  const context = {
    data: {
      ...deepmerge(server, client, { arrayMerge: overwriteMerge }),
      isValidating,
    },
    globalSettings,
  } as PDPContext

  return (
    <>
      {isClientOfferEnabled && (
        <Head>
          <link
            rel="preload"
            href={getOfferUrl(product.sku)}
            as="fetch"
            crossOrigin="anonymous"
            fetchPriority="high"
          />
        </Head>
      )}
      {/* SEO */}
      <NextSeo
        title={title}
        description={description}
        canonical={meta.canonical}
        openGraph={{
          type: 'og:product',
          url: meta.canonical,
          title,
          description,
          images: product.image.map((img) => ({
            url: img.url,
            alt: img.alternateName,
          })),
        }}
        additionalMetaTags={[
          {
            property: 'product:price:amount',
            content: productPriceAmountMetatag ?? undefined,
          },
          {
            property: 'product:price:currency',
            content: currency.code,
          },
          {
            property: 'product:id',
            content: product.isVariantOf?.productGroupID ?? undefined,
          },
          {
            property: 'product:sku',
            content: product.sku,
          },
          {
            property: 'product:name',
            content: product.name,
          },
          {
            property: 'product:category',
            content: itemListElements[0]?.name ?? undefined,
          },
          {
            property: 'product:url',
            content: meta.canonical,
          },
          {
            property: 'product:brand',
            content: product.brand.name,
          },
          ...(productCondition
            ? [
                {
                  property: 'product:condition',
                  content: productCondition,
                },
              ]
            : []),
        ]}
        languageAlternates={hreflangLinks}
        titleTemplate={titleTemplate}
      />

      <BreadcrumbJsonLd itemListElements={itemListElements} />

      <ProductJsonLd
        id={`${meta.canonical}${settings?.seo?.id ?? ''}`}
        mainEntityOfPage={`${meta.canonical}${
          settings?.seo?.mainEntityOfPage ?? ''
        }`}
        productName={title}
        description={description}
        brand={product.brand.name}
        sku={product.sku}
        // Spread conditionally so an unregistered identifier is omitted rather
        // than published as "": next-seo passes these through untouched.
        {...(product.gtin && { gtin: product.gtin })}
        {...(product.mpn && { mpn: product.mpn })}
        {...(product.releaseDate && { releaseDate: product.releaseDate })}
        images={product.image.map((img) => img.url)} // Somehow, Google does not understand this valid Schema.org schema, so we need to do conversions
        {...(offers && { offers })}
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
      <LocalizedProductProvider otherLocales={server.product.otherLocales}>
        <PageProvider context={context}>
          <RenderSections
            sections={sections}
            globalSections={globalSections}
            components={COMPONENTS}
          />
        </PageProvider>
      </LocalizedProductProvider>
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
      mpn
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
          priceToken
          seller {
            identifier
          }
        }
      }

      isVariantOf {
        productGroupID
      }

      otherLocales {
        locale
        slug
      }

      ...ProductDetailsFragment_product
    }
  }
`)

export const getStaticProps: GetStaticProps<
  Props,
  { slug: string },
  PreviewData
> = async ({ params, previewData, locale }) => {
  const slug = params?.slug ?? ''
  const contentContext = { previewData, locale }

  const [
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ] = getGlobalSectionsData(contentContext)

  const [
    searchResult,
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  ] = await Promise.all([
    execute<ServerProductQueryQueryVariables, ServerProductQueryQuery>({
      variables: {
        locator: [
          { key: 'slug', value: slug },
          { key: 'channel', value: getChannelForLocale(locale) },
          { key: 'locale', value: locale },
        ],
      },
      operation: query,
    }),
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ])

  const { data, errors = [] } = searchResult

  const notFound = errors.find(isNotFoundError)

  if (notFound) {
    if (storeConfig.experimental.enableRedirects) {
      const redirect = await getRedirect({ pathname: `/${slug}/p` })

      if (redirect) {
        return {
          redirect,
          revalidate: 60 * 5, // 5 minutes
        }
      }
    }

    return {
      notFound: true,
      revalidate:
        (storeConfig as StoreConfig).experimental.revalidate404 ?? 60 * 5, // 5 minutes
    }
  }

  if (errors.length > 0) {
    throw errors[0]
  }

  const cmsPage: PDPContentType = await contentService.getPdpContent(
    data.product,
    {
      ...contentContext,
      slug,
      locale,
    }
  )

  const { seo } = data.product
  const title = seo.title
  const description = seo.description
  // Without the locale, static rendering has no request to match a binding
  // against and falls back to the default locale, so a localized PDP would
  // point its canonical at the default locale's prefix.
  const canonical = `${getStoreURL(locale)}${seo.canonical}`

  const meta = { title, description, canonical }

  const offers = toProductJsonLdOffer(data.product.offers.offers[0], {
    priceCurrency: data.product.offers.priceCurrency,
    url: canonical,
  })

  const globalSectionsResult = injectGlobalSections({
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  })

  return {
    props: {
      data,
      ...cmsPage,
      meta,
      offers,
      globalSections: globalSectionsResult,
      key: seo.canonical,
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
