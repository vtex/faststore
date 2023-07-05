import { isNotFoundError } from '@faststore/api'
import { gql } from '@faststore/graphql-utils'
import type { Locator } from '@vtex/client-cms'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { BreadcrumbJsonLd, NextSeo, ProductJsonLd } from 'next-seo'
import type { ComponentType } from 'react'

import type {
  ServerProductPageQueryQuery,
  ServerProductPageQueryQueryVariables,
} from '@generated/graphql'
import RenderSections from 'src/components/cms/RenderSections'
import BannerNewsletter from 'src/components/sections/BannerNewsletter/BannerNewsletter'
import Breadcrumb from 'src/components/sections/Breadcrumb'
import CrossSellingShelf from 'src/components/sections/CrossSellingShelf'
import ProductDetails from 'src/components/sections/ProductDetails'
import CUSTOM_COMPONENTS from 'src/customizations/components'
import { useSession } from 'src/sdk/session'
import { mark } from 'src/sdk/tests/mark'
import { execute } from 'src/server'
import type { PDPContentType } from 'src/server/cms'
import { getPage } from 'src/server/cms'

import GlobalSections, {
  GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import storeConfig from '../../../faststore.config'

/**
 * Sections: Components imported from each store's custom components and '../components/sections' only.
 * Do not import or render components from any other folder in here.
 */
const COMPONENTS: Record<string, ComponentType<any>> = {
  Breadcrumb,
  ProductDetails,
  CrossSellingShelf,
  BannerNewsletter,
  ...CUSTOM_COMPONENTS,
}

type Props = ServerProductPageQueryQuery &
  PDPContentType & {
    globalSections: GlobalSectionsData
    meta: {
      title: string
      description: string
      canonical: string
    }
  }

function Page({ product, sections, globalSections, offers, meta }: Props) {
  const { currency } = useSession()

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
      <RenderSections
        context={product}
        sections={sections}
        components={COMPONENTS}
      />
    </GlobalSections>
  )
}

const query = gql`
  query ServerProductPageQuery($slug: String!) {
    product(locator: [{ key: "slug", value: $slug }]) {
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
`

export const getStaticProps: GetStaticProps<
  Props,
  { slug: string },
  Locator
> = async ({ params, previewData }) => {
  const slug = params?.slug ?? ''
  const [searchResult, cmsPage, globalSections] = await Promise.all([
    execute<ServerProductPageQueryQueryVariables, ServerProductPageQueryQuery>({
      variables: { slug },
      operationName: query,
    }),
    getPage<PDPContentType>({
      ...(previewData?.contentType === 'pdp' ? previewData : null),
      contentType: 'pdp',
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
      ...data,
      ...cmsPage,
      meta,
      offers,
      globalSections,
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
