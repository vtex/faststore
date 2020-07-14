import { api, Product } from '@vtex/gatsby-source-vtex'
import React, { FC, Fragment } from 'react'
import { useSWRInfinite, mutate as mutateSWR } from 'swr'

import { jsonFetcher } from '../../utils/fetcher'
import FetchMoreBtn from './FetchMore'
import SyncPage, { PAGE_SIZE } from './SyncPage'

export interface Props {
  categoryId: number
  offset: number
}

const getUrl = (page: number, categoryId: number) => {
  const from = (page - 1) * PAGE_SIZE
  const to = page * PAGE_SIZE - 1

  return api.search({
    categoryIds: [`${categoryId}`],
    from,
    to,
  })
}

export const prefetchPageData = (page: number, categoryId: number) => {
  const url = getUrl(page, categoryId)

  mutateSWR(url, jsonFetcher(url))
}

const Page: FC<Props> = ({ categoryId, offset = 2 }) => {
  const { data, error, mutate, size, setSize } = useSWRInfinite<Product[]>(
    (page, previousPageData) => {
      if (previousPageData?.length === 0) {
        return null
      }

      return getUrl(page + offset, categoryId)
    },
    jsonFetcher
  )

  const isLoadingInitialData = !data && !error
  const isLoadingMore = !!(
    isLoadingInitialData ||
    (data && size && typeof data[size - 1] === 'undefined')
  )

  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE)

  const products = data ?? []

  return (
    <Fragment>
      {products.map((ps, index) => (
        <SyncPage key={`summary-page-${index}`} products={ps} />
      ))}
      {isReachingEnd ? null : (
        <FetchMoreBtn
          onClick={() => setSize!(size! + 1)}
          disabled={isLoadingMore}
          loading={isLoadingMore}
        />
      )}
    </Fragment>
  )
}

export default Page
