/* eslint-disable react-hooks/rules-of-hooks */
import { api, Category } from '@vtex/gatsby-source-vtex'
import React, { FC, useEffect } from 'react'
import useSWR, { mutate, useSWRPages } from 'swr'
import { Button, Grid } from 'theme-ui'

import { FetchedList, productListFetcher } from '../../utils/fetcher'
import { ProductSummary } from '../ProductSummary'

export const PAGE_SIZE = 10

interface Props {
  category: Category
}

const prefetchMap = new Map<string, Promise<FetchedList>>()

const ranges = (page: number) => ({
  from: (page - 1) * PAGE_SIZE,
  to: page * PAGE_SIZE - 1,
})

// Prefetches next page so LoadMore button is fast
const prefetchPage = (categoryId: number, nextPage: number) => {
  const { from, to } = ranges(nextPage)

  const url = api.search({
    categoryIds: [`${categoryId}`],
    from,
    to,
  })

  // Deduplicate requests
  if (prefetchMap.has(url)) {
    return
  }

  const promiseData = productListFetcher(url).catch((e) => {
    // remove from prefetch map if anything goes wrong
    prefetchMap.delete(url)
    throw e
  })

  prefetchMap.set(url, promiseData)
  mutate(url, promiseData)
}

const ProductList: FC<Props> = ({ category }) => {
  const { products, categoryId, name } = category
  const {
    pages,
    pageCount,
    isLoadingMore,
    loadMore,
    isReachingEnd,
  } = useSWRPages<number | null, FetchedList, unknown>(
    name,
    ({ offset, withSWR }) => {
      const page = offset ?? 1
      const { from, to } = ranges(page)
      const isSync = page === 1 && products.length > 0

      const url = api.search({
        categoryIds: [`${categoryId}`],
        from,
        to,
      })

      const initialData = isSync
        ? {
            products: products.slice(0, PAGE_SIZE),
            total: Infinity,
            range: { from, to },
          }
        : undefined

      const { data } = withSWR(useSWR(url, productListFetcher, { initialData }))

      if (!data) {
        return null
      }

      return data.products.map((product, index) => (
        <ProductSummary
          key={product.productId}
          syncProduct={product}
          lazyLoad={index > 3}
        />
      ))
    },
    ({ data }) => {
      // no data was fetched, maybe it's finished
      if (!data) {
        return null
      }

      const {
        total,
        range: { to },
      } = data

      // No more pages to fetch
      if (to >= total) {
        return null
      }
      const next = (to + 1) / PAGE_SIZE + 1
      return next
    },
    [products]
  )

  // Prefetch next page
  useEffect(() => prefetchPage(categoryId, pageCount + 1), [
    categoryId,
    pageCount,
  ])

  return (
    <>
      <Grid my={4} gap={3} columns={[1, 2, 3, 4]}>
        {pages}
      </Grid>
      {isReachingEnd ? null : (
        <Button variant="loadMore" onClick={loadMore} disabled={isLoadingMore}>
          {isLoadingMore ? 'Loading...' : 'More'}
        </Button>
      )}
    </>
  )
}

export default ProductList
