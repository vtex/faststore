import { gql } from '@vtex/gatsby-plugin-graphql'

import { useQuery } from '../../../sdk/graphql/useQuery'
import { useSearchSuggestionsContext } from '../base/hooks'
import {
  ProductsSuggestionsQuery,
  ProductsSuggestionsQueryQuery,
  ProductsSuggestionsQueryQueryVariables,
} from './__generated__/ProductsSuggestionsQuery.graphql'

interface Props {
  term: string
  maxItems: number // max number of products to return. Hard limit of 5
}

export const useProductsSuggestions = ({ maxItems, term }: Props) => {
  const context = useSearchSuggestionsContext()
  const response = useQuery<
    ProductsSuggestionsQueryQuery,
    ProductsSuggestionsQueryQueryVariables
  >({
    ...ProductsSuggestionsQuery,
    variables: {
      fullText: term,
    },
    suspense: false,
  })

  const query = {
    ...response,
    data: response.data && {
      vtex: {
        productSuggestions: {
          count: response.data.vtex.productSuggestions?.count,
          products: response.data.vtex.productSuggestions?.products.slice(
            0,
            maxItems
          ),
        },
      },
    },
  }

  return {
    query,
    ...context,
  }
}

export const query = gql`
  query ProductsSuggestionsQuery(
    $fullText: String!
    $facetKey: String
    $facetValue: String
    $productOriginVtex: Boolean = false
    $simulationBehavior: VTEX_SimulationBehavior = default
  ) {
    vtex {
      productSuggestions(
        fullText: $fullText
        facetKey: $facetKey
        facetValue: $facetValue
        productOriginVtex: $productOriginVtex
        simulationBehavior: $simulationBehavior
      ) {
        count
        products {
          key: productId
          ...ProductSummary_syncProduct
        }
      }
    }
  }
`
