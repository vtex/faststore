/* eslint-disable react-hooks/rules-of-hooks */
import { Category, FilterOptions, Product } from '@vtex/gatsby-source-vtex'
import React, { FC, Fragment, useCallback, useMemo } from 'react'
import { useSWRInfinite } from 'swr'
import { Button, Grid } from 'theme-ui'

import { useSearchFilters } from '../../providers/SearchFilter'
import OverlaySpinner from './OverlaySpinner'
import Page from './Page'

const PAGE_SIZE = 12

const searchContext = (
  page: number,
  categoryId: number,
  filters: FilterOptions
) => {
  const from = page * PAGE_SIZE
  const to = (page + 1) * PAGE_SIZE - 1

  return JSON.stringify({
    ...filters,
    categoryIds: [`${categoryId}`],
    from,
    to,
  })
}

const searchFetcher = async (options: string) => {
  const { fetcher } = await import('./fetcher')
  const context = JSON.parse(options)

  return fetcher(context)
}

interface Props {
  category: Category
}

const List: FC<Props> = ({ category: { products, categoryId } }) => {
  const [filters] = useSearchFilters()
  const hasFilters = useMemo(() => Object.values(filters).some((v) => !!v), [
    filters,
  ])

  const useSyncData = products.length > 0 && !hasFilters

  const { data, error, size, setSize } = useSWRInfinite<Product[]>(
    (page, previousPageData) => {
      if (page !== 0 && previousPageData?.length === 0) {
        return null
      }

      return searchContext(page, categoryId, filters)
    },
    searchFetcher,
    {
      revalidateOnMount: true,
      initialData: useSyncData ? [products] : undefined,
      initialSize: 1,
    }
  )

  const fetchMore = useCallback(() => setSize!((s) => s + 1), [setSize])

  const isLoadingInitialData = !data && !error
  const isLoadingMore =
    isLoadingInitialData ||
    !!(data && size && typeof data[size - 1] === 'undefined')

  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || !!(data && data[data.length - 1]?.length < PAGE_SIZE)

  return (
    <Fragment>
      <Grid my={4} gap={3} columns={[1, 2, 3, 4]}>
        {data ? (
          data
            .slice(0, size!)
            .map((ps, index) => (
              <Page key={`summary-page-${index}`} products={ps} />
            ))
        ) : (
          <OverlaySpinner />
        )}
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
