import { isNotFoundError } from '@faststore/api'
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
import { default as GLOBAL_COMPONENTS } from '../../components/cms/global/Components'
import RenderSections from '../../components/cms/RenderSections'
import { getComponentKey } from '../../utils/cms'
import BannerNewsletter from '../../components/sections/BannerNewsletter/BannerNewsletter'
import { OverriddenDefaultBannerText as BannerText } from '../../components/sections/BannerText/OverriddenDefaultBannerText'
import { OverriddenDefaultBreadcrumb as Breadcrumb } from '../../components/sections/Breadcrumb/OverriddenDefaultBreadcrumb'
import { OverriddenDefaultCrossSellingShelf as CrossSellingShelf } from '../../components/sections/CrossSellingShelf/OverriddenDefaultCrossSellingShelf'
import { OverriddenDefaultHero as Hero } from '../../components/sections/Hero/OverriddenDefaultHero'
import { OverriddenDefaultNewsletter as Newsletter } from '../../components/sections/Newsletter/OverriddenDefaultNewsletter'
import { OverriddenDefaultProductDetails as ProductDetails } from '../../components/sections/ProductDetails/OverriddenDefaultProductDetails'
import { OverriddenDefaultProductShelf as ProductShelf } from '../../components/sections/ProductShelf/OverriddenDefaultProductShelf'
import ProductTiles from 'src/components/sections/ProductTiles'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import PLUGINS_COMPONENTS from 'src/plugins'
import { getRedirect } from 'src/sdk/redirects'
import { useSession } from 'src/sdk/session'
import { execute } from 'src/server'

import storeConfig from 'discovery.config'
import {
  getGlobalSectionsData,
  type GlobalSectionsData,
} from '../../components/cms/GlobalSections'
import { getOfferUrl, useOffer } from 'src/sdk/offer'
import PageProvider, { type PDPContext } from '../../sdk/overrides/PageProvider'
import { useProductQuery } from '../../sdk/product/useProductQuery'
import { injectGlobalSections } from '../../server/cms/global'
import type { PDPContentType } from '../../server/cms/pdp'
import { contentService } from '../../server/content/service'
import type { PreviewData } from '../../server/content/types'

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
  globalSections: globalSectionsProp,
  offers,
  meta,
}: Props) {
  const { currency } = useSession()

  const { product } = server
  const {
    seo: { pdp: pdpSeo, ...storeSeo },
  } = storeConfig

  // SEO data
  const title = meta?.title ?? storeSeo.title
  const titleTemplate = pdpSeo.titleTemplate ?? storeSeo?.titleTemplate
  const description =
    meta?.description ||
    pdpSeo.descriptionTemplate.replace(/%s/g, () => title) ||
    storeSeo.description

  let itemListElements = product.breadcrumbList.itemListElement ?? []
  if (itemListElements.length !== 0) {
    itemListElements = itemListElements.map(
      ({ item: pathname, name, position }) => {
        const pageUrl = storeConfig.storeUrl + pathname

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
        mainEntityOfPage={`${meta.canonical}${
          settings?.seo?.mainEntityOfPage ?? ''
        }`}
        productName={title}
        description={description}
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
          globalSections={globalSections}
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
  PreviewData
> = async ({ params, previewData }) => {
  const slug = params?.slug ?? ''

  const [
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ] = getGlobalSectionsData(previewData)

  const [
    searchResult,
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  ] = await Promise.all([
    execute<ServerProductQueryQueryVariables, ServerProductQueryQuery>({
      variables: { locator: [{ key: 'slug', value: slug }] },
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
    }
  }

  if (errors.length > 0) {
    throw errors[0]
  }

  const cmsPage: PDPContentType = await contentService.getPdpContent(
    data.product,
    {
      previewData,
      slug,
    }
  )

  const { seo } = data.product
  const title = seo.title
  const description = seo.description
  const canonical = `${storeConfig.storeUrl}${seo.canonical}`

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
