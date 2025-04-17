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
import { PdpClient } from './pdp-client'
import { getOffer } from 'src/sdk/offer'
import deepmerge from 'deepmerge'

interface PdpProps {
  params: Promise<{
    slug: string
  }>
}

// Array merging strategy from deepmerge that makes client arrays overwrite server array
// https://www.npmjs.com/package/deepmerge
const overwriteMerge = (_: any[], sourceArray: any[]) => sourceArray

export default async function PdpServer(props: PdpProps) {
  const { params } = props

  const { slug } = await params

  console.log({
    pdp: slug,
  })

  const productId = slug
  const data = await getData(productId)
  const product = data.props?.data.product
  // let offer = { offers: {} }

  // try {
  //   const res = await getOffer({ skuId: product?.id ?? '' })
  //   offer = res
  // } catch (e) {
  //   console.log(e)
  //   console.log('failed with offer')
  // }

  // const finalProduct = deepmerge(
  //   product ?? {},
  //   {
  //     offers: offer.offers,
  //   },
  //   { arrayMerge: overwriteMerge }
  // )
  //

  const finalProduct = product

  // console.log({
  //   product,
  //   offer,
  //   finalProduct,
  // })

  const context = {
    data: {
      product: finalProduct,
      isValidating: false,
    },
  }

  return (
    <PdpClient
      globalSections={data.props?.globalSections}
      sections={data.props?.sections}
      context={context}
    />
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

  const notFound = errors.find(isNotFoundError)

  if (notFound) {
    // if (storeConfig.experimental.enableRedirects) {
    //   const redirect = await getRedirect({ pathname: `/${slug}/p` })

    //   if (redirect) {
    //     return {
    //       redirect,
    //       revalidate: 60 * 5, // 5 minutes
    //     }
    //   }
    // }

    return {
      notFound: true,
    }
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
    props: {
      data,
      ...cmsPage,
      meta,
      offers,
      globalSections: globalSectionsResult,
      key: seo.canonical,
    },
    revalidate: false,
  }
}

export async function generateStaticParams() {
  return []
}
