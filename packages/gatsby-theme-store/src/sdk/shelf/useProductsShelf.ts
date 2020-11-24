import { gql } from '@vtex/gatsby-plugin-graphql'

import { useQuery } from '../graphql/useQuery'
import {
  ProductsShelfQuery,
  ProductsShelfQueryQuery,
  ProductsShelfQueryQueryVariables,
} from './__generated__/ProductsShelfQuery.graphql'

export type ProductsShelfOptions = Partial<ProductsShelfQueryQueryVariables>

export const useProductsShelf = (variables: ProductsShelfOptions) => {
  const { data } = useQuery<
    ProductsShelfQueryQuery,
    ProductsShelfQueryQueryVariables
  >({
    ...ProductsShelfQuery,
    variables,
    suspense: true,
  })

  return {
    products: data?.vtex?.products ?? null,
  }
}

export const query = gql`
  query ProductsShelfQuery(
    $simulationBehavior: VTEX_SimulationBehavior = default
    $hideUnavailableItems: Boolean = true
    $salesChannel: String = "1"
    $collection: String
    $category: String = ""
    $orderBy: String = "OrderByTopSaleDESC"
    $query: String
    $map: String
    $from: Int = 0
    $to: Int = 9
  ) {
    vtex {
      products(
        query: $query
        map: $map
        from: $from
        to: $to
        orderBy: $orderBy
        collection: $collection
        salesChannel: $salesChannel
        hideUnavailableItems: $hideUnavailableItems
        category: $category
        simulationBehavior: $simulationBehavior
      ) {
        ...ProductSummary_product
      }
    }
  }
`
