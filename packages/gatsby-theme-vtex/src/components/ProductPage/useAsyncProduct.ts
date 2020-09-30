import { gql } from '@vtex/gatsby-plugin-graphql'

import {
  AsyncProductQuery,
  AsyncProductQueryQuery,
  AsyncProductQueryQueryVariables,
} from './__generated__/AsyncProductQuery.graphql'
import { useQuery, QueryOptions } from '../../sdk/graphql/useQuery'

export type Options = Omit<
  QueryOptions,
  'query' | 'sha256Hash' | 'operationName'
>

export const useAsyncProduct = (
  variables: AsyncProductQueryQueryVariables,
  options?: Options
) => {
  const { data } = useQuery<
    AsyncProductQueryQuery,
    AsyncProductQueryQueryVariables
  >({
    ...AsyncProductQuery,
    variables,
    suspense: true,
    ...options,
  })

  const product = data?.vtex.product ?? null

  return { product }
}

export const query = gql`
  query AsyncProductQuery($slug: String) {
    vtex {
      product(slug: $slug) {
        productId
        productName
        description
        linkText
        items {
          itemId
          images {
            imageUrl
            imageText
          }
          sellers {
            commercialOffer: commertialOffer {
              availableQuantity: AvailableQuantity
              listPrice: ListPrice
              price: Price
            }
          }
        }
      }
    }
  }
`
