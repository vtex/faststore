import { api, Product, FilterOptions } from '@vtex/gatsby-source-vtex'
import React, { FC } from 'react'
import useSWR from 'swr'

import { jsonFetcher } from '../../utils/fetcher'
import SyncPage from './SyncPage'
import { useSearchFilters } from '../../providers/SearchFilter'

export interface Props {
  page: number
  categoryId: number
}

export const PAGE_SIZE = 12

export const getUrl = (
  page: number,
  categoryId: number,
  filters: FilterOptions
) => {
  const from = page * PAGE_SIZE
  const to = (page + 1) * PAGE_SIZE - 1

  return api.search({
    ...filters,
    categoryIds: [`${categoryId}`],
    from,
    to,
  })
}

const AsyncPage: FC<Props> = ({ page, categoryId }) => {
  const [filters] = useSearchFilters()
  const url = getUrl(page, categoryId, filters)
  const { data } = useSWR<Product[]>(url, jsonFetcher, { suspense: true })

  return data ? <SyncPage products={data} /> : null
}

export default AsyncPage
