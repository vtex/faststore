import { api, Product } from '@vtex/gatsby-source-vtex'
import React, { FC } from 'react'
import useSWR, { mutate } from 'swr'
import { pagesWithSWRType } from 'swr/dist/types'

import { FetchedList, productListFetcher } from '../../utils/fetcher'
import { ProductSummary } from '../ProductSummary'

export const PAGE_SIZE = 10

const prefetchMap = new Map<string, Promise<FetchedList>>()

const ranges = (page: number) => ({
  from: (page - 1) * PAGE_SIZE,
  to: page * PAGE_SIZE - 1,
})

// Prefetches next page so LoadMore button is fast
export const prefetchPage = (categoryId: number, nextPage: number) => {
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

interface Props {
  offset: number | null
  withSWR: pagesWithSWRType<FetchedList, unknown>
  categoryId: number
  products: Product[]
}

const Page: FC<Props> = ({ offset, withSWR, categoryId, products }) => {
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

  return (
    <>
      {data.products.map((product, index) => (
        <ProductSummary
          key={product.productId}
          syncProduct={product}
          lazyLoad={index > 3}
        />
      ))}
    </>
  )
}

export default Page
