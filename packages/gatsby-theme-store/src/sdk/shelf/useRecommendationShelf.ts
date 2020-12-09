import { gql } from '@vtex/gatsby-plugin-graphql'

import { useQuery } from '../graphql/useQuery'
import { ProductRecommendationsQuery } from './__generated__/ProductRecommendationsQuery.graphql'
import type {
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
  query ProductRecommendationsQuery(
    $identifier: VTEX_ProductUniqueIdentifier!
    $type: VTEX_CrossSelingInputEnum!
  ) {
    vtex {
      productRecommendations(identifier: $identifier, type: $type) {
        ...ProductSummary_product
      }
    }
  }
`
