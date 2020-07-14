import { api } from '@vtex/gatsby-source-vtex'
import React, { FC } from 'react'
import useSWR, { mutate } from 'swr'

import { productListFetcher } from '../../utils/fetcher'
import SyncPage, { PAGE_SIZE } from './SyncPage'

export interface Props {
  page: number
  categoryId: number
  setNextPage: (x: number | null) => void
  setLoadingMore: (x: boolean) => void
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

export const prefetchPage = (page: number, categoryId: number) => {
  const url = getUrl(page, categoryId)

  mutate(url, productListFetcher(url))
}

const Page: FC<Props> = ({ page, categoryId, setNextPage, setLoadingMore }) => {
  const url = getUrl(page, categoryId)
  const { data, error } = useSWR(url, productListFetcher, { suspense: true })

  // data loaded
  setLoadingMore(false)

  if (error) {
    // TODO: when there is an error ?
    throw new Error(error)
  }

  const { products, total } = data!

  // Reached end. There won't be a next page
  if (total <= page * PAGE_SIZE) {
    setNextPage(null)
  }

  if (products.length === 0) {
    return null
  }

  return <SyncPage products={data!.products} />
}

export default Page
