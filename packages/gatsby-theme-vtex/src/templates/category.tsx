/* eslint-disable react-hooks/rules-of-hooks */
import { Category, Product } from '@vtex/gatsby-source-vtex'
import { graphql } from 'gatsby'
import React, { FC, useState } from 'react'
import useSWR, { useSWRPages } from 'swr'
import { Button, Flex, Heading, Grid } from 'theme-ui'

import Layout from '../components/Layout'
import { ProductList } from '../components/ProductList'
import SEO from '../components/Seo'
import { urls } from '../utils/api'

export const staticQuery = graphql`
  query($id: String!) {
    category(id: { eq: $id }) {
      name
      slug
      categoryId
    }
  }
`

interface Props {
  data: {
    category: Category
  }
}

const CategoryTemplate: FC<Props> = ({ data }) => {
  const [totalItems, setTotalItems] = useState<number>(9)
  const [isError, setIsError] = useState(false)
  const { pages, isLoadingMore, loadMore } = useSWRPages(
    data.category.slug,
    ({ withSWR, offset }) => {
      const { data: products, error } = withSWR(
        useSWR(
          urls.productsPageByCategory({
            categoryId: data.category.categoryId,
            from: offset?.from ?? 0,
            to: offset?.to ?? 9,
          }),
          (url: string) => fetch(url).then((r) => r.json())
        )
      )

      if (error) {
        setIsError(true)

        return null
      }

      if (!products) {
        return null
      }

      return (
        <ProductList
          data={products.map((product: Product) => ({
            ...product,
            id: product.productId,
            slug: `/${product.linkText}/p`,
          }))}
        />
      )
    },
    () => {
      const from = totalItems + 1
      const to = totalItems + 10

      setTotalItems(to)

      return { from, to }
    }
  )

  return (
    <Layout>
      <SEO title={data.category.name} />
      <Flex sx={{ flexDirection: 'column' }} my={4}>
        <Heading as="h1">{data.category.name}</Heading>
        <Grid marginY={4} gap={3} columns={[2, null, 4]}>
          {pages}
        </Grid>
        {isError ? (
          <p>não foi possível carregar os produtos</p>
        ) : (
          <Button
            variant="loadMore"
            onClick={loadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Flex>
    </Layout>
  )
}

export default CategoryTemplate
