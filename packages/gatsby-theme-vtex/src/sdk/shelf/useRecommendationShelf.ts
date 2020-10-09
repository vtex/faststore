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
        ...ProductSummary_product
      }
    }
  }
`
