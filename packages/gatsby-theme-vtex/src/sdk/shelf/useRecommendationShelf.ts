import { gql } from '@vtex/gatsby-plugin-graphql'

import { useQuery } from '../graphql/useQuery'
import {
  ProductRecommendationsQuery,
  ProductRecommendationsQueryQuery,
  ProductRecommendationsQueryQueryVariables,
} from './__generated__/ProductRecommendationsQuery.graphql'

interface Props {
  value: string
}

export const useRecommendationShelf = ({ value }: Props) => {
  const { data } = useQuery<
    ProductRecommendationsQueryQuery,
    ProductRecommendationsQueryQueryVariables
  >({
    ...ProductRecommendationsQuery,
    variables: { value },
    suspense: true,
  })

  return {
    productRecommendations: data?.vtex?.productRecommendations ?? null,
  }
}

export const query = gql`
  query ProductRecommendationsQuery($value: ID!) {
    vtex {
      productRecommendations(
        identifier: { field: id, value: $value }
        type: viewAndBought
      ) {
        productId
        productName
        linkText
        productClusters {
          name
        }
        items {
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
