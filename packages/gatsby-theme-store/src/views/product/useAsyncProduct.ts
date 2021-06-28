import { gql } from '@vtex/gatsby-plugin-graphql'

import { useQuery } from '../../sdk/graphql/useQuery'
import { AsyncProductQuery } from './__generated__/AsyncProductQuery.graphql'
import type {
  AsyncProductQueryQuery,
  AsyncProductQueryQueryVariables,
} from './__generated__/AsyncProductQuery.graphql'
import type { QueryOptions } from '../../sdk/graphql/useQuery'

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

  const product = data?.vtex.product

  return { product }
}

export const query = gql`
  query AsyncProductQuery($slug: String!, $regionId: String) {
    vtex {
      product(slug: $slug, regionId: $regionId) {
        id: productId
        productName
        productReference
        description
        linkText
        specificationGroups {
          name
          specifications {
            name
            values
          }
        }
        items {
          variations {
            name
            values
          }
          itemId
          images {
            imageUrl
            imageText
          }
          sellers {
            sellerId
            commercialOffer: commertialOffer {
              installments: Installments {
                value: Value
                numberOfInstallments: NumberOfInstallments
                interestRate: InterestRate
              }
              availableQuantity: AvailableQuantity
              price: Price
              listPrice: ListPrice
              gifts {
                skuName
                images {
                  imageUrl
                }
              }
              spotPrice
              teasers {
                name
              }
            }
          }
        }
      }
    }
  }
`
