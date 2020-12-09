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

  const product = data?.vtex.product ?? null

  return { product }
}

export const query = gql`
  query AsyncProductQuery($slug: String) {
    vtex {
      product(slug: $slug) {
        productId
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
              maxInstallments: Installments(criteria: MAX_WITHOUT_INTEREST) {
                value: Value
                numberOfInstallments: NumberOfInstallments
              }
              installments: Installments(criteria: ALL) {
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
