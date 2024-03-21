import { isNotFoundError } from '@faststore/api'
import type { Locator } from '@vtex/client-cms'
import deepmerge from 'deepmerge'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { BreadcrumbJsonLd, NextSeo, ProductJsonLd } from 'next-seo'
import type { ComponentType } from 'react'

import { gql } from '@generated'
import {
  type ServerProductQueryQuery,
  type ServerProductQueryQueryVariables,
} from '@generated/graphql'
import RenderSections from 'src/components/cms/RenderSections'
import BannerNewsletter from 'src/components/sections/BannerNewsletter/BannerNewsletter'
import { OverriddenDefaultBannerText as BannerText } from 'src/components/sections/BannerText/OverriddenDefaultBannerText'
import { OverriddenDefaultBreadcrumb as Breadcrumb } from 'src/components/sections/Breadcrumb/OverriddenDefaultBreadcrumb'
import { OverriddenDefaultCrossSellingShelf as CrossSellingShelf } from 'src/components/sections/CrossSellingShelf/OverriddenDefaultCrossSellingShelf'
import { OverriddenDefaultProductShelf as ProductShelf } from 'src/components/sections/ProductShelf/OverriddenDefaultProductShelf'
import { OverriddenDefaultProductDetails as ProductDetails } from 'src/components/sections/ProductDetails/OverriddenDefaultProductDetails'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import { useSession } from 'src/sdk/session'
import { mark } from 'src/sdk/tests/mark'
import { execute } from 'src/server'

import storeConfig from 'faststore.config'
import GlobalSections, {
  GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import PageProvider, { PDPContext } from 'src/sdk/overrides/PageProvider'
import { useProductQuery } from 'src/sdk/product/useProductQuery'
import { PDPContentType, getPDP } from 'src/server/cms/pdp'

/**
 * Sections: Components imported from each store's custom components and '../components/sections' only.
 * Do not import or render components from any other folder in here.
 */
const COMPONENTS: Record<string, ComponentType<any>> = {
  Breadcrumb,
  ProductDetails,
  CrossSellingShelf,
  BannerNewsletter,
  ProductShelf,
  BannerText,
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
const overwriteMerge = (_, sourceArray) => sourceArray

function Page({ data: server, sections, globalSections, offers, meta }: Props) {
  const { product } = server
  const { currency } = useSession()

  // Stale while revalidate the product for fetching the new price etc
  const { data: client, isValidating } = useProductQuery(product.id, {
    product: product,
  })

  const context = {
    data: {
      ...deepmerge(server, client, { arrayMerge: overwriteMerge }),
      isValidating,
    },
  } as PDPContext

  return (
    <GlobalSections {...globalSections}>
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
        <RenderSections sections={sections} components={COMPONENTS} />
      </PageProvider>
    </GlobalSections>
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

  const cmsPage: PDPContentType = await getPDP(slug, data.product, previewData)

  const { seo } = data.product
  const title = seo.title || storeConfig.seo.title
  const description = seo.description || storeConfig.seo.description
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

  return {
    props: {
      data,
      ...cmsPage,
      meta,
      offers,
      globalSections,
      key: seo.canonical,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

Page.displayName = 'Page'

export default mark(Page)
