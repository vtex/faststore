import { gql } from '@vtex/gatsby-plugin-graphql'

import {
  AsyncProductQuery,
  AsyncProductQueryQuery,
  AsyncProductQueryQueryVariables,
} from './__generated__/AsyncProductQuery.graphql'
import { useQuery, QueryOptions } from '../../sdk/graphql/useQuery'

type Props = Omit<QueryOptions, 'query' | 'sha256Hash' | 'operationName'>

type BaseOptions = Pick<QueryOptions, 'query' | 'sha256Hash' | 'operationName'>

interface Query {
  vtex: {
    product: any
  }
}

export const createUseAsyncProduct = <Q extends Query, V>(
  query: BaseOptions
) => (options: Props) => {
  const { data, isValidating } = useQuery<Q, V>({
    ...query,
    suspense: true,
    ...options,
  })

  const isLoading = !data && isValidating
  const product = data?.vtex.product ?? null

  return { product, isLoading }
}

export const useAsyncProduct = createUseAsyncProduct<
  AsyncProductQueryQuery,
  AsyncProductQueryQueryVariables
>(AsyncProductQuery)

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
