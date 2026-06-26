import { gql } from '@faststore/core/api'
import type { FetchRecommendationsQueryQuery } from '@generated/graphql'
import { useQuery } from 'src/sdk/graphql/useQuery'

// Recommendations return the same normalized `StoreProduct` shape as the search
// response, so the shelf renders identical product cards to regular shelves.
// We select `...ProductSummary_product` (the fragment consumed by `ProductCard`)
// to keep this interface consistent with the rest of the components.
const query = gql(`query FetchRecommendationsQuery(
  $campaignVrn: String!
  $userId: String
  $products: [String!]
) {
  recommendations(
    userId: $userId
    campaignVrn: $campaignVrn
    products: $products
  ) {
    products {
      ...ProductSummary_product
    }
    correlationId
    campaign {
      id
      title
      type
    }
  }
}
`)

export type RecommendationInput = {
  userId: string
  campaignVrn: string
  products: string[]
}

export type RecommendationResponse =
  FetchRecommendationsQueryQuery['recommendations']
export type RecommendationProduct = RecommendationResponse['products'][number]

export const useRecommendations = (args: RecommendationInput | null) => {
  const { data, isLoading, error } = useQuery<
    FetchRecommendationsQueryQuery,
    RecommendationInput
  >(query, args ?? ({} as RecommendationInput), {
    doNotRun: args === null,
  })

  return {
    data: data?.recommendations,
    error,
    isLoading,
  }
}
