/* eslint-disable react-hooks/rules-of-hooks */
import { Product } from '@vtex/gatsby-source-vtex'
import React, { FC, Fragment, useCallback, useMemo } from 'react'
import { useSWRInfinite } from 'swr'
import { Button, Grid } from 'theme-ui'

import { useSearchFilters } from '../../providers/SearchFilter'
import OverlaySpinner from './OverlaySpinner'
import Page from './Page'
import query from './query'
import graphqlFetcher from '../../utils/graphqlFetcher'

const PAGE_SIZE = 8

const fetcher = async (options: string) => {
  const variables = JSON.parse(options)
  const { data } = await graphqlFetcher(query, variables)

  return data.productSearch.products
}

interface Props {
  search: any
}

const List: FC<Props> = ({
  search: {
    productSearch: { products },
  },
}) => {
  const [filters] = useSearchFilters()

  // Initial data to start swr
  const initialData = useMemo(() => {
    const hasProducts = products.length > 0

    if (hasProducts) {
      return [products]
    }

    return undefined
  }, [products])

  const { data, error, size, setSize } = useSWRInfinite<Product[]>(
    (page, previousPageData) => {
      if (page !== 0 && previousPageData?.length === 0) {
        return null
      }

      const from = page * PAGE_SIZE
      const to = (page + 1) * PAGE_SIZE - 1

      return JSON.stringify({
        ...filters,
        from,
        to,
      })
    },
    fetcher,
    {
      revalidateOnMount: true,
      initialData,
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

  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || !!(data && data[viewSize - 1]?.length < PAGE_SIZE)

  if (!data) {
    return <OverlaySpinner />
  }

  return (
    <Fragment>
      <Grid my={4} gap={3} columns={[1, 2, 3, 4]}>
        {data.slice(0, viewSize).map((ps, index) => (
          <Page key={`summary-page-${index}`} products={ps} />
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

export default List
