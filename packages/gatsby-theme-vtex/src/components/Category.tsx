/* eslint-disable react-hooks/rules-of-hooks */
/** @jsx jsx */
import { api, Category } from '@vtex/gatsby-source-vtex'
import { FC } from 'react'
import useSWR, { mutate, useSWRPages } from 'swr'
import { Button, Flex, Grid, Heading, jsx } from 'theme-ui'

import { FetchedList, productListFetcher } from '../utils/fetcher'
import Container from './Container'
import { ProductSummary } from './ProductSummary'

export const PAGE_SIZE = 3

interface Props {
  category: Category
}

const prefetchMap = new Map<string, Promise<FetchedList>>()

const ranges = (page: number) => ({
  from: (page - 1) * PAGE_SIZE,
  to: page * PAGE_SIZE - 1,
})

const CategoryTemplate: FC<Props> = ({ category }) => {
  const { products } = category
  const { pages, isLoadingMore, loadMore, isReachingEnd } = useSWRPages<
    number | null,
    FetchedList,
    unknown
  >(
    category.name,
    ({ offset, withSWR }) => {
      const page = offset ?? 1
      const { from, to } = ranges(page)
      const isSync = page === 1 && products.length > 0

      const url = api.search({
        categoryIds: [`${category.categoryId}`],
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
      // no data was fetched, let's fetch the first page
      if (!data) {
        return 1
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

      // Prefetch next page
      const { from: nextFrom, to: nextTo } = ranges(next)
      if (nextTo >= total) {
        const url = api.search({
          categoryIds: [`${category.categoryId}`],
          from: nextFrom,
          to: nextTo,
        })
        // Deduplicate requests
        if (!prefetchMap.has(url)) {
          const promiseData = productListFetcher(url).catch((e) => {
            // remove from prefetch map if anything goes wrong
            prefetchMap.delete(url)
            throw e
          })
          prefetchMap.set(url, promiseData)
          mutate(url, promiseData)
        }
      }

      return next
    },
    [products]
  )

  return (
    <Container>
      <Flex sx={{ flexDirection: 'column' }} my={4}>
        <Heading as="h1">{category.name}</Heading>
        <Grid marginY={4} gap={3} columns={[1, 2, 3, 4]}>
          {pages}
        </Grid>
        {isReachingEnd ? null : (
          <Button
            variant="loadMore"
            onClick={loadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? 'Loading...' : 'More'}
          </Button>
        )}
      </Flex>
    </Container>
  )
}

export default CategoryTemplate
