import { RouteComponentProps } from '@reach/router'
import { graphql, useStaticQuery } from 'gatsby'
import React, { FC, useMemo } from 'react'
import { Grid } from 'theme-ui'

import Layout from '../components/Layout'
import { ProductList } from '../components/ProductList'
import { AsyncProductsProvider } from '../components/providers/AsyncProducts'
import SEO from '../components/SEO/siteMetadata'
import { SyncProductItem } from '../types/product'

interface Data {
  allProduct: {
    nodes: SyncProductItem[]
  }
}

const Home: FC<RouteComponentProps> = () => {
  const { allProduct } = useStaticQuery<Data>(graphql`
    {
      allProduct {
        nodes {
          id
          slug
          productId
          productName
          items {
            itemId
            images {
              imageUrl
              imageText
            }
          }
        }
      }
    }
  `)
  const syncProducts = allProduct.nodes
  const productIds = useMemo(() => syncProducts.map((x) => x.productId), [
    syncProducts,
  ])
  const filterOptions = {
    productIds,
  }

  return (
    <Layout>
      <SEO />
      <AsyncProductsProvider
        filterOptions={filterOptions}
        syncProducts={syncProducts}
      >
        <Grid my={4} gap={3} columns={[1, 2, 3, 4]}>
          <ProductList syncProducts={syncProducts} />
        </Grid>
      </AsyncProductsProvider>
    </Layout>
  )
}

export default Home
