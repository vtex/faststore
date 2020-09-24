import React, { FC } from 'react'
import { gql } from '@vtex/gatsby-plugin-graphql'
import { Box } from '@vtex/store-ui'

import Shelf, { Props as ShelfProps } from '.'
import {
  ShelfQuery,
  ShelfQueryQuery,
  ShelfQueryQueryVariables,
} from './__generated__/ShelfQuery.graphql'
import { useQuery } from '../../sdk/graphql/useQuery'

export interface Props extends Omit<ShelfProps, 'products'> {
  searchParams: Partial<ShelfQueryQueryVariables>
}

const AsyncShelf: FC<Props> = ({ searchParams, ...props }) => {
  const { data } = useQuery<ShelfQueryQuery, ShelfQueryQueryVariables>({
    ...ShelfQuery,
    variables: searchParams,
  })

  if (!data) {
    return <Box variant="asyncShelfPlaceholder" />
  }

  return <Shelf products={data?.vtex.products ?? []} {...props} />
}

export const query = gql`
  query ShelfQuery(
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
        ...ProductSummary_syncProduct
      }
    }
  }
`

export default AsyncShelf
