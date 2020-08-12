/* eslint-disable react-hooks/rules-of-hooks */
import { gql } from '@vtex/gatsby-plugin-graphql'
import { Button, Grid } from '@vtex/store-ui'
import React, { FC, Fragment, useCallback } from 'react'

import { useQueryInfinite, useSearchFilters } from '../../sdk'
import {
  SearchQuery,
  SearchQueryQuery,
  SearchQueryQueryVariables,
} from './__generated__/SearchQuery.graphql'
import OverlaySpinner from './OverlaySpinner'
import Page from './Page'

const PAGE_SIZE = 10

interface Props {
  initialData: SearchQueryQuery | undefined
}

const List: FC<Props> = ({ initialData }) => {
  const filters = useSearchFilters()
  const { data, error, size, setSize } = useQueryInfinite<
    SearchQueryQuery,
    SearchQueryQueryVariables
  >(
    SearchQuery,
    (page, previousPageData) => {
      if (
        page !== 0 &&
        previousPageData?.vtex.productSearch?.products?.length === 0
      ) {
        return null
      }

      const from = page * PAGE_SIZE
      const to = (page + 1) * PAGE_SIZE - 1

      return {
        ...filters,
        from,
        to,
      }
    },
    {
      revalidateOnMount: true,
      initialData: initialData && [initialData],
      initialSize: 2, // 2 will always prefetch the next page
    }
  )

  const fetchMore = useCallback(() => setSize!((s) => s + 1), [setSize])

  // Since we prefetch the next page, we always render one page less from
  // what we have in memory
  const viewSize = Math.max(1, size! - 1)

  // The code below was copied from SWR's own repo example
  // https://codesandbox.io/s/swr-infinite-z6r0r?file=/src/App.js
  const isLoadingInitialData = !data && !error
  const isLoadingMore =
    isLoadingInitialData ||
    !!(data && typeof data[viewSize - 1] === 'undefined')

  const isEmpty = data?.[0]?.vtex.productSearch!.products!.length === 0
  const isReachingEnd =
    isEmpty ||
    !!(
      data &&
      data[viewSize - 1]?.vtex.productSearch!.products!.length < PAGE_SIZE
    )

  if (!data) {
    return <OverlaySpinner />
  }

  return (
    <Fragment>
      <Grid my={4} gap={3} columns={[2, 2, 3, 5]}>
        {data.slice(0, viewSize).map((searchQuery, index) => (
          <Page
            key={`summary-page-${index}`}
            products={searchQuery.vtex.productSearch!.products!}
          />
        ))}
      </Grid>
      {isReachingEnd ? null : (
        <Button
          variant="loadMore"
          onClick={fetchMore}
          disabled={isReachingEnd || isLoadingMore}
        >
          {isLoadingMore ? 'Loading...' : 'More'}
        </Button>
      )}
    </Fragment>
  )
}

export const query = gql`
  query SearchQuery(
    $query: String
    $map: String
    $from: Int
    $to: Int
    $orderBy: String
  ) {
    vtex {
      productSearch(
        query: $query
        map: $map
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

export default List
