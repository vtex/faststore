import React from 'react'
import { gql } from '@vtex/gatsby-plugin-graphql'
import { Spinner, Center, Grid, Box } from '@vtex/store-ui'
import type { FC } from 'react'

import ProductSummary from '../../ProductSummary'
import { useQuery } from '../../../sdk/graphql/useQuery'
import { useSearch } from '../../../sdk/search/useSearch'
import { SearchQuery } from './__generated__/SearchQuery.graphql'
import { useQueryVariablesFromSearchParams } from '../../../sdk/search/converter/useQueryVariablesFromSearchParams'
import type {
  SearchQueryQuery,
  SearchQueryQueryVariables,
} from './__generated__/SearchQuery.graphql'

interface Props {
  columns: number[]
  /** @description true if should display the page. This is used for prefetching a page */
  display: boolean
  cursor: number
  initialData?: SearchQueryQuery
}

const Page: FC<Props> = ({ display, cursor, initialData, columns }) => {
  const { searchParams, pageInfo } = useSearch()
  const variables = useQueryVariablesFromSearchParams(
    {
      ...searchParams,
      page: cursor,
    },
    pageInfo
  )

  const { data } = useQuery<SearchQueryQuery, SearchQueryQueryVariables>({
    ...SearchQuery,
    variables,
    initialData,
    revalidateOnMount: true,
  })

  if (display === false) {
    return null
  }

  if (data == null) {
    return (
      <Box sx={{ height: ['200px', '500px'] }}>
        <Center>
          <Spinner />
        </Center>
      </Box>
    )
  }

  return (
    <Grid variant="search" columns={columns}>
      {data.vtex.productSearch?.products?.map((product) => (
        <ProductSummary loading="lazy" key={product!.id!} product={product!} />
      ))}
    </Grid>
  )
}

export const query = gql`
  query SearchQuery(
    $query: String
    $map: String
    $fullText: String
    $selectedFacets: [VTEX_SelectedFacetInput!]
    $from: Int
    $to: Int
    $orderBy: String
    $hideUnavailableItems: Boolean = false
  ) {
    vtex {
      productSearch(
        hideUnavailableItems: $hideUnavailableItems
        selectedFacets: $selectedFacets
        fullText: $fullText
        query: $query
        map: $map
        from: $from
        to: $to
        orderBy: $orderBy
      ) {
        products {
          ...ProductSummary_product
        }
      }
    }
  }
`

export default Page
