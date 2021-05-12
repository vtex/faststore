import { gql } from '@vtex/gatsby-plugin-graphql'

import { useQuery } from '../graphql/useQuery'
import { useRegion } from '../region/useRegion'
import type {
  SuggestionsQueryQuery,
  SuggestionsQueryQueryVariables,
} from './__generated__/SuggestionsQuery.graphql'
import { SuggestionsQuery } from './__generated__/SuggestionsQuery.graphql'

interface Props {
  term: string
  maxItems: number // max number of products to return. Hard limit of 5
}

export const useSuggestions = ({ maxItems, term }: Props) => {
  const { regionId } = useRegion()
  const { data } = useQuery<
    SuggestionsQueryQuery,
    SuggestionsQueryQueryVariables
  >({
    ...SuggestionsQuery,
    variables: {
      fullText: term,
      regionId,
    },
    suspense: false,
  })

  return {
    total: data?.vtex.productSuggestions?.total ?? 0,
    products: data?.vtex.productSuggestions?.products.slice(0, maxItems),
  }
}

export const query = gql`
  query SuggestionsQuery(
    $fullText: String!
    $regionId: String
    $facetKey: String
    $facetValue: String
    $simulationBehavior: VTEX_SearchResolver_SimulationBehavior = default
  ) {
    vtex {
      productSuggestions(
        fullText: $fullText
        regionId: $regionId
        facetKey: $facetKey
        facetValue: $facetValue
        simulationBehavior: $simulationBehavior
      ) {
        total: count
        products {
          ...ProductSummary_product
        }
      }
    }
  }
`
