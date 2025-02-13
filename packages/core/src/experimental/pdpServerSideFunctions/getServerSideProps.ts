import type { GetServerSideProps } from 'next'
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
import type { PDPProps, StoreConfig } from './getStaticProps'

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

export const getServerSideProps: GetServerSideProps<
  PDPProps,
  { slug: string },
  Locator
> = async ({ params, previewData, req, res }) => {
  const slug = params?.slug ?? ''
  const regionId = req.cookies['vtex-faststore-regionid'] ?? ''

  const { data, errors = [] } = await execute<
    ServerProductQueryQueryVariables,
    ServerProductQueryQuery
  >({
    variables: {
      locator: [
        { key: 'slug', value: slug },
        { key: 'regionId', value: regionId },
      ],
    },
    operation: query,
  })

  const notFound = errors.find(isNotFoundError)

  if (notFound) {
    return {
      notFound: true,
    }
  }

  if (errors.length > 0) {
    throw errors[0]
  }

  const globalSections = await getGlobalSectionsData(previewData)
  const cmsPage: PDPContentType = await getPDP(data.product, previewData)

  const { seo } = data.product
  const meta = {
    title: seo.title || storeConfig.seo.title,
    description: seo.description || storeConfig.seo.description,
    canonical: `${storeConfig.storeUrl}${seo.canonical}`,
  }

  let offer = {}
  if (data.product.offers.offers.length > 0) {
    const { listPrice, ...offerData } = data.product.offers.offers[0]

    offer = offerData
  }

  const offers = {
    ...offer,
    priceCurrency: data.product.offers.priceCurrency,
    url: meta.canonical,
  }

  // 5 minutes of fresh content and 1 year of stale content
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=31536000, stale-if-error=31536000'
  )

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
