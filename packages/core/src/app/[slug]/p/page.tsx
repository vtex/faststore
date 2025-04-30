import { isNotFoundError } from '@faststore/api'
import { gql } from '@generated/gql'
import type {
  ServerProductQueryQuery,
  ServerProductQueryQueryVariables,
} from '@generated/graphql'
import { getGlobalSectionsData } from 'src/components/cms/GlobalSections'
import { execute } from 'src/server'
import { getPDP, type PDPContentType } from 'src/server/cms/pdp'
import storeConfig from 'discovery.config'
import { injectGlobalSections } from 'src/server/cms/global'
import { PDP_COMPONENTS, PdpData } from './pdp-client'
import { notFound } from 'next/navigation'
import RenderSections from 'src/components/cms/RenderSections'

interface PdpProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PdpServer({ params }: PdpProps) {
  const { slug: productId } = await params

  const {
    data: { product },
    sections,
    globalSections,
  } = await getData(productId)

  return (
    <PdpData
      serverData={{
        data: {
          product,
        },
      }}
    >
      <RenderSections
        sections={sections}
        globalSections={globalSections.sections}
        components={PDP_COMPONENTS}
      />
    </PdpData>
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

async function getData(slug = '', previewData: any = undefined) {
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

  if (errors.find(isNotFoundError)) {
    // if (storeConfig.experimental.enableRedirects) {
    //   const redirect = await getRedirect({ pathname: `/${slug}/p` })

    //   if (redirect) {
    //     return {
    //       redirect,
    //       revalidate: 60 * 5, // 5 minutes
    //     }
    //   }
    // }

    notFound()
  }

  if (errors.length > 0) {
    throw errors[0]
  }

  const cmsPage: PDPContentType = await getPDP(data.product, previewData)

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
    data,
    ...cmsPage,
    meta,
    offers,
    globalSections: globalSectionsResult,
    key: seo.canonical,
  }
}

export async function generateStaticParams() {
  return []
}
