import React, { FC } from 'react'
import { gql } from '@vtex/gatsby-plugin-graphql'
import { Box } from '@vtex/store-ui'

import Shelf, { Props as ShelfProps } from './Sync'
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

  return (
    <Shelf products={data?.vtex.productSearch?.products ?? []} {...props} />
  )
}

export const query = gql`
  query ShelfQuery(
    $query: String
    $map: String
    $selectedFacets: [VTEX_SelectedFacetInput!]
    $fullText: String
    $from: Int
    $to: Int
    $orderBy: String
  ) {
    vtex {
      productSearch(
        query: $query
        map: $map
        selectedFacets: $selectedFacets
        fullText: $fullText
        from: $from
        to: $to
        orderBy: $orderBy
      ) {
        products {
          ...ProductSummary_syncProduct
        }
      }
    }
  }
`

export default AsyncShelf
