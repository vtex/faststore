/* eslint-disable react-hooks/rules-of-hooks */
/** @jsx jsx */
import { api, Category, Product } from '@vtex/gatsby-source-vtex'
import { Link } from 'gatsby'
import { FC } from 'react'
import useSWR, { useSWRPages, responseInterface } from 'swr'
import { Button, Flex, Grid, Heading, jsx } from 'theme-ui'

import { rawJsonFetcher } from '../utils/fetcher'
import { ProductSummary } from './ProductSummary'

export const PAGE_SIZE = 10

interface Props {
  category: Category
  categorySearchResult: {
    products: Product[]
  }
}

interface FetchedCategory {
  products: Product[]
  total: number
  range: {
    from: number
    to: number
  }
}

const categoryFetcher = async (url: string): Promise<FetchedCategory> => {
  const response = await rawJsonFetcher(url)
  const products: Product[] = await response.json()
  const resources = response.headers.get('resources')!
  const [range, total] = resources.split('/')
  const [from, to] = range.split('-')
  return {
    products,
    total: Number(total),
    range: {
      from: Number(from),
      to: Number(to),
    },
  }
}

const nextPage = ({ data }: responseInterface<FetchedCategory, unknown>) => {
  // no data was fetched, let's fetch the first page
  if (!data) {
    return 1
  }

  const {
    total,
    range: { to },
  } = data

  // No more pages to fetch
  if (to + 1 === total) {
    return null
  }

  const pages = (to + 1) / PAGE_SIZE
  return pages + 1
}

const CategoryTemplate: FC<Props> = ({ categorySearchResult, category }) => {
  const { pages, isLoadingMore, loadMore, isReachingEnd } = useSWRPages<
    number | null,
    FetchedCategory,
    unknown
  >(
    category.name,
    ({ offset, withSWR }) => {
      const page = offset ?? 1
      const from = (page - 1) * PAGE_SIZE
      const to = page * PAGE_SIZE - 1
      const isSync = page === 1 && categorySearchResult.products

      const url = api.search({
        categoryIds: [`${category.categoryId}`],
        from,
        to,
      })

      const initialData = isSync
        ? {
            products: categorySearchResult.products,
            total: Infinity,
            range: { from, to },
          }
        : undefined

      const { data } = withSWR(
        useSWR(url, categoryFetcher, {
          suspense: false,
          initialData,
        })
      )

      if (!data) {
        return null
      }

      return data.products.map((product, index) => (
        <Link
          key={product.productId}
          to={`/${product.linkText}/p`}
          sx={{
            textDecoration: 'none',
            color: 'text',
          }}
        >
          <ProductSummary
            syncProduct={product}
            lazyLoad={index > 3}
            index={index}
          />
        </Link>
      ))
    },
    nextPage,
    []
  )

  return (
    <Flex sx={{ flexDirection: 'column' }} my={4}>
      <Heading as="h1">{category.name}</Heading>
      <Grid marginY={4} gap={3} columns={[1, 2, 3, 4]}>
        {pages}
      </Grid>
      {isReachingEnd ? null : (
        <Button variant="loadMore" onClick={loadMore} disabled={isLoadingMore}>
          {isLoadingMore ? 'Loading...' : 'More'}
        </Button>
      )}
    </Flex>
  )
}

export default CategoryTemplate
