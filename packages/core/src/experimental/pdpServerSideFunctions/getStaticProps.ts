import type { GetStaticPaths, GetStaticProps } from 'next'
import type { Locator } from '@vtex/client-cms'
import { isNotFoundError } from '@faststore/api'

import {
  getGlobalSectionsData,
  type GlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import { execute } from 'src/server'
import { getPDP, type PDPContentType } from 'src/server/cms/pdp'
import { gql } from '@generated'
import type {
  ServerProductQueryQuery,
  ServerProductQueryQueryVariables,
} from '@generated/graphql'
import storeConfig from 'discovery.config'

export type StoreConfig = typeof storeConfig & {
  experimental: {
    revalidate?: number
    enableClientOffer?: boolean
  }
}

export type PDPProps = PDPContentType & {
  data: ServerProductQueryQuery
  globalSections: GlobalSectionsData
  meta: {
    title: string
    description: string
    canonical: string
  }
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

/*
  Depending on the value of the storeConfig.experimental.enablePdpSSR flag, the function used will be getServerSideProps (./getServerSideProps).
  Our CLI that does this process of converting from getStaticProps to getServerSideProps.
*/
export const getStaticProps: GetStaticProps<
  PDPProps,
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
    revalidate: (storeConfig as StoreConfig).experimental.revalidate ?? false,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}
