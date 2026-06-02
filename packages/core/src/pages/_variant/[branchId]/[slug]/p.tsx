import { isNotFoundError } from '@faststore/api'
import storeConfig from 'discovery.config'
import type { GetStaticPaths, GetStaticProps } from 'next'

import { gql } from '@generated'
import type {
  ServerProductQueryQuery,
  ServerProductQueryQueryVariables,
} from '@generated/graphql'
import {
  type GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import { getStoreURL } from 'src/sdk/localization/useLocalizationConfig'
import { getRedirect } from 'src/sdk/redirects'
import { execute } from 'src/server'
import { injectGlobalSections } from 'src/server/cms/global'
import type { PDPContentType } from 'src/server/cms/pdp'
import { contentService } from 'src/server/content/service'
import type { PreviewData } from 'src/server/content/types'
import { getVariantBranchId } from 'src/server/content/utils'
import { getChannelForLocale } from 'src/utils/localization/bindingPaths'

// Reuse the original PDP page component — only the data fetching differs.
import ProductPage from '../../../[slug]/p'

type StoreConfig = typeof storeConfig & {
  experimental: {
    revalidate?: number
    enableClientOffer?: boolean
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
  PDPContentType & {
    data: ServerProductQueryQuery
    globalSections: GlobalSectionsData
    meta: { title: string; description: string; canonical: string }
  },
  { branchId: string; slug: string },
  PreviewData
> = async ({ params, previewData, locale }) => {
  const slug = params?.slug ?? ''
  const branchId = getVariantBranchId(params)
  const contentContext = { previewData, locale, branchId }

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
  const canonical = `${getStoreURL()}${seo.canonical}`

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

export default ProductPage
