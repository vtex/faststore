import { gql } from '@vtex/gatsby-plugin-graphql'

import { useQuery } from '../graphql/useQuery'
import {
  ProductRecommendationsQuery,
  ProductRecommendationsQueryQuery,
  ProductRecommendationsQueryQueryVariables,
} from './__generated__/ProductRecommendationsQuery.graphql'

export type RecommendationOptions = ProductRecommendationsQueryQueryVariables

export const useRecommendationShelf = (variables: RecommendationOptions) => {
  const { data } = useQuery<
    ProductRecommendationsQueryQuery,
    ProductRecommendationsQueryQueryVariables
  >({
    ...ProductRecommendationsQuery,
    variables,
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
        ...ProductSummary_product
      }
    }
  }
`
