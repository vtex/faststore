import { useSession } from '@faststore/sdk'
import { gql } from '@vtex/graphql-utils'
import { BreadcrumbJsonLd, NextSeo, ProductJsonLd } from 'next-seo'
import { useRouter } from 'next/router'
import type { GetStaticPaths, GetStaticProps } from 'next'

import ProductDetails from 'src/components/sections/ProductDetails'
import ProductShelf from 'src/components/sections/ProductShelf'
import { ITEMS_PER_SECTION } from 'src/constants'
import { mark } from 'src/sdk/tests/mark'
import { execute } from 'src/server'
import type {
  ServerProductPageQueryQuery,
  ServerProductPageQueryQueryVariables,
} from '@generated/graphql'

import storeConfig from '../../../store.config'

type Props = ServerProductPageQueryQuery

function Page({ product }: Props) {
  const { currency } = useSession()
  const router = useRouter()
  const title = product?.seo.title ?? storeConfig.seo.title
  const description = product?.seo.description ?? storeConfig.seo.description
  const canonical = `${storeConfig.storeUrl}/${router.query.slug}/p`

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
        itemListElements={product.breadcrumbList.itemListElement ?? []}
      />
      <ProductJsonLd
        productName={product.name}
        description={product.description}
        brand={product.brand.name}
        sku={product.sku}
        gtin={product.gtin}
        images={product.image.map((img) => img.url)} // Somehow, Google does not understand this valid Schema.org schema, so we need to do conversions
        offersType="AggregateOffer"
        offers={{
          ...product.offers,
          price: product.offers.offers[0].price.toString(),
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

      <ProductDetails product={product} />

      <ProductShelf
        first={ITEMS_PER_SECTION}
        term={product.brand.name}
        title="You might also like"
        withDivisor
      />
    </>
  )
}

const query = gql`
  query ServerProductPageQuery($id: String!) {
    product(locator: [{ key: "id", value: $id }]) {
      id: productID
      slug

      seo {
        title
        description
      }

      brand {
        name
      }

      slug
      sku
      gtin
      name
      description

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

      ...ProductDetailsFragment_product
    }
  }
`

export const getStaticProps: GetStaticProps<
  ServerProductPageQueryQuery,
  { slug: string }
> = async ({ params }) => {
  const id = params?.slug.split('-').pop() ?? ''

  const { data } = await execute<
    ServerProductPageQueryQueryVariables,
    ServerProductPageQueryQuery
  >({
    variables: { id },
    operationName: query,
  })

  if (data === null) {
    return {
      notFound: true,
    }
  }

  return {
    props: data,
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
