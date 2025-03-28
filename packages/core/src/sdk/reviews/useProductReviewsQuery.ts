import { gql } from '@generated/gql'
import { type QueryOptions, useQuery } from '../graphql/useQuery'
import type {
  ClientProductReviewsQuery as Query,
  ClientProductReviewsQueryVariables as Variables,
} from '@generated/graphql'

export const query = gql(`
  query ClientProductReviews (
    $productId: String!
    $after: Int
    $first: Int
    $sort: StoreProductListReviewsSort
    $rating: Int
  ) {
    reviews(
      productId: $productId
      after: $after
      first: $first
      sort: $sort
      rating: $rating
    ) {
      data {
        id
        productId
        rating
        title
        text
        reviewDateTime
        reviewerName
        verifiedPurchaser
      }
      range {
        from
        to
        total
      }
    }
  }
`)

export const useProductReviewsQuery = (
  variables: Variables,
  options?: QueryOptions
) => {
  const { data, error, isLoading } = useQuery<Query, Variables>(
    query,
    variables,
    { ...options }
  )

  return { data, isLoading, error }
}
