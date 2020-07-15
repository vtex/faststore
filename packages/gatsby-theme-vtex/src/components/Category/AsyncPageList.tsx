import { api, Product } from '@vtex/gatsby-source-vtex'
import React, { FC, useEffect } from 'react'
import { mutate as mutateSWR, useSWRInfinite } from 'swr'

import { jsonFetcher } from '../../utils/fetcher'
import SyncPage from './SyncPage'

export interface Props {
  categoryId: number
  offset: 0 | 1 // Start by page index 0 or 1
  targetSize: number // Target number of pages to show
  setLoading: (x: boolean) => void // FetchMore button controler
  setReachedEnd: (x: boolean) => void // FetchMore button controler
}

const PAGE_SIZE = 12

const getUrl = (page: number, categoryId: number) => {
  const from = page * PAGE_SIZE
  const to = (page + 1) * PAGE_SIZE - 1

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

const PageList: FC<Props> = ({
  offset,
  categoryId,
  targetSize,
  setLoading,
  setReachedEnd,
}) => {
  const { data, error, size, setSize } = useSWRInfinite<Product[]>(
    (page, previousPageData) => {
      if (previousPageData?.length === 0) {
        return null
      }

      return getUrl(page + offset, categoryId)
    },
    jsonFetcher,
    {
      initialSize: 2, // always preload the next page
    }
  )

  // true if this component is being preloaded
  const preloading = size! > targetSize && offset > 0

  const isLoadingInitialData = !data && !error
  const isLoadingMore = !!(
    isLoadingInitialData ||
    (data && size && typeof data[size - 1] === 'undefined')
  )

  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd = !!(
    isEmpty ||
    (data && data[data.length - 1]?.length < PAGE_SIZE)
  )

  // Toggle FetchMore
  useEffect(() => {
    if (size! < targetSize) {
      setSize?.(targetSize)
    }
  }, [setSize, size, targetSize])

  // FetchMore button controlers
  useEffect(() => {
    !preloading && setLoading(isLoadingMore)
  }, [isLoadingMore, preloading, setLoading])
  useEffect(() => {
    !preloading && setReachedEnd(isReachingEnd)
  }, [isReachingEnd, preloading, setReachedEnd])

  const pagesData = !preloading && data ? data.slice(0, size! - 1) : []

  return (
    <>
      {pagesData.map((ps, index) => (
        <SyncPage key={`summary-page-${index}`} products={ps} />
      ))}
    </>
  )
}

export default PageList
