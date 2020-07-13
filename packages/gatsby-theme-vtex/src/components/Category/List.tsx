/* eslint-disable react-hooks/rules-of-hooks */
import { api, Category } from '@vtex/gatsby-source-vtex'
import React, { FC, useState } from 'react'
import useSWR, { responseInterface, useSWRPages } from 'swr'
import { Button } from 'theme-ui'

import { FetchedList, productListFetcher } from '../../utils/fetcher'
import Page, { PAGE_SIZE } from './Page'

const INITIAL_PAGE = 2

interface Props {
  category: Category
}

const nextPage = ({ data }: responseInterface<FetchedList, unknown>) => {
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
}

const List: FC<Props> = ({ category }) => {
  const { products, categoryId, name } = category
  const { pages, isLoadingMore, loadMore, isReachingEnd } = useSWRPages<
    number | null,
    FetchedList,
    unknown
  >(
    name,
    ({ offset, withSWR }) => {
      const page = offset ?? INITIAL_PAGE
      const from = (page - 1) * PAGE_SIZE
      const to = page * PAGE_SIZE - 1

      const url = api.search({
        categoryIds: [`${categoryId}`],
        from,
        to,
      })

      const { data } = withSWR(useSWR(url, productListFetcher))

      if (!data) {
        return null
      }

      return <Page products={data.products} />
    },
    nextPage,
    [products]
  )

  return (
    <>
      {pages}
      {isReachingEnd ? null : (
        <Button variant="loadMore" onClick={loadMore} disabled={isLoadingMore}>
          {isLoadingMore ? 'Loading...' : 'More'}
        </Button>
      )}
    </>
  )
}

export default List
