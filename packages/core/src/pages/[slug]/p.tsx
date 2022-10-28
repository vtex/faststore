import { isNotFoundError } from '@faststore/api'
import { gql } from '@faststore/graphql-utils'
import { BreadcrumbJsonLd, NextSeo, ProductJsonLd } from 'next-seo'
import type { GetStaticPaths, GetStaticProps } from 'next'
import type { ComponentType } from 'react'
import type { Locator } from '@vtex/client-cms'

import RenderPageSections from 'src/components/cms/RenderPageSections'
import BannerNewsletter from 'src/components/sections/BannerNewsletter/BannerNewsletter'
import CrossSellingShelf from 'src/components/sections/CrossSellingShelf'
import ProductDetails from 'src/components/sections/ProductDetails'
import { useSession } from 'src/sdk/session'
import { mark } from 'src/sdk/tests/mark'
import { execute } from 'src/server'
import { getPage } from 'src/server/cms'
import type { PDPContentType } from 'src/server/cms'
import CUSTOM_SECTIONS from 'src/customizations'
import type {
  ServerProductPageQueryQuery,
  ServerProductPageQueryQueryVariables,
} from '@generated/graphql'

import storeConfig from '../../../store.config'

/**
 * Sections: Components imported from each store's custom components and '../components/sections' only.
 * Do not import or render components from any other folder in here.
 */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ProductDetails,
  BannerNewsletter,
  CrossSellingShelf,
  ...CUSTOM_SECTIONS,
}

type Props = ServerProductPageQueryQuery & PDPContentType

function Page({ product, sections }: Props) {
  const { currency } = useSession()
  const { seo } = product
  const title = seo.title || storeConfig.seo.title
  const description = seo.description || storeConfig.seo.description
  const canonical = `${storeConfig.storeUrl}${seo.canonical}`

  return (
    <>
      {/* SEO */}
      <NextSeo
        title={title}
        description={description}
        canonical={canonical}
        openGraph={{
          type: 'og:product',
          url: canonical,
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
        offersType="AggregateOffer"
        offers={{
          ...product.offers,
          ...product.offers.offers[0],
          url: canonical,
        }}
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
      <RenderPageSections
        context={product}
        sections={sections}
        components={COMPONENTS}
      />
    </>
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
  const [cmsPage, searchResult] = await Promise.all([
    getPage<PDPContentType>({
      ...(previewData?.contentType === 'pdp' ? previewData : null),
      contentType: 'pdp',
    }),
    execute<ServerProductPageQueryQueryVariables, ServerProductPageQueryQuery>({
      variables: { slug },
      operationName: query,
    }),
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

  return {
    props: {
      ...data,
      ...cmsPage,
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
