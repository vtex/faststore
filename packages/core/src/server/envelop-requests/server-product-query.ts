import { ServerExecuteFunction } from '..'
import { gql } from '../../../@generated/gql'
import type {
  ServerProductQueryQuery,
  ServerProductQueryQueryVariables,
} from '../../../@generated/graphql'

export function serverProductRequest({
  variables,
}: {
  variables: ServerProductQueryQueryVariables
}) {
  return ServerExecuteFunction<
    ServerProductQueryQueryVariables,
    ServerProductQueryQuery
  >({
    variables,
    operation: query,
  })
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
