import { RouteComponentProps } from '@reach/router'
import { graphql, useStaticQuery } from 'gatsby'
import React, { FC } from 'react'
import { Grid } from 'theme-ui'

import Layout from '../components/Layout'
import { ProductList } from '../components/ProductList'
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
            sellers {
              sellerId
              commertialOffer {
                AvailableQuantity
                Price
              }
            }
          }
        }
      }
    }
  `)
  const syncProducts = allProduct.nodes
  return (
    <Layout>
      <SEO />
      <Grid my={4} gap={3} columns={[1, 2, 3, 4]}>
        <ProductList syncProducts={syncProducts} />
      </Grid>
    </Layout>
  )
}

export default Home
