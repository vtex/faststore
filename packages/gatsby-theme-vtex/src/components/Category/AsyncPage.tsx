import { api, Product } from '@vtex/gatsby-source-vtex'
import React, { FC } from 'react'
import useSWR from 'swr'

import { jsonFetcher } from '../../utils/fetcher'
import SyncPage from './SyncPage'

export interface Props {
  page: number
  categoryId: number
}

export const PAGE_SIZE = 12

export const getUrl = (page: number, categoryId: number) => {
  const from = page * PAGE_SIZE
  const to = (page + 1) * PAGE_SIZE - 1

  return api.search({
    categoryIds: [`${categoryId}`],
    from,
    to,
  })
}

const AsyncPage: FC<Props> = ({ page, categoryId }) => {
  const url = getUrl(page, categoryId)
  const { data } = useSWR<Product[]>(url, jsonFetcher, { suspense: true })

  return data ? <SyncPage products={data} /> : null
}

export default AsyncPage
