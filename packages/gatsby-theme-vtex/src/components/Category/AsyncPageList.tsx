import { Product } from '@vtex/gatsby-source-vtex'
import React, { FC, useEffect } from 'react'
import { useSWRInfinite } from 'swr'

import { jsonFetcher } from '../../utils/fetcher'
import { getUrl, PAGE_SIZE } from './AsyncPage'
import SyncPage from './SyncPage'

export interface Props {
  categoryId: number
  targetSize: number // Target number of pages to show
  setLoading: (x: boolean) => void // FetchMore button controler
  setReachedEnd: (x: boolean) => void // FetchMore button controler
  resetSize: (x: number) => void // Reset targetsize
}

const PageList: FC<Props> = ({
  categoryId,
  targetSize,
  setLoading,
  setReachedEnd,
  resetSize,
}) => {
  const { data, size, setSize } = useSWRInfinite<Product[]>(
    (page, previousPageData) => {
      if (previousPageData?.length === 0) {
        return null
      }

      return getUrl(page + 1, categoryId)
    },
    jsonFetcher,
    {
      initialSize: 1, // always preload the next page
    }
  )

  const isLoadingMore = !!(
    data &&
    size &&
    size > 1 &&
    typeof data[size - 2] === 'undefined'
  )

  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd = !!(
    isEmpty ||
    (data && data[data.length - 1]?.length < PAGE_SIZE)
  )

  // Toggle FetchMore
  useEffect(() => {
    if (!size) {
      return
    }

    if (size < targetSize - 1) {
      setSize?.(targetSize - 1)
    }

    if (size > targetSize - 1) {
      resetSize(size + 1)
    }
  }, [resetSize, setSize, size, targetSize])

  // FetchMore button controlers
  useEffect(() => {
    setLoading(isLoadingMore)
  }, [isLoadingMore, setLoading])
  useEffect(() => {
    setReachedEnd(isReachingEnd)
  }, [isReachingEnd, setReachedEnd])

  if (!data || !size) {
    return null
  }

  return (
    <>
      {data.slice(0, size - 1).map((ps, index) => (
        <SyncPage key={`summary-page-${index}`} products={ps} />
      ))}
    </>
  )
}

export default PageList
