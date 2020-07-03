import { RouteComponentProps } from '@reach/router'
import { graphql, useStaticQuery } from 'gatsby'
import React, { FC } from 'react'
import { Grid } from 'theme-ui'
import { Product } from '@vtex/gatsby-source-vtex'

import Layout from '../components/Layout'
import { ProductList } from '../components/ProductList'
import SEO from '../components/Seo'

interface Data {
  allProduct: {
    nodes: Product[]
  }
}

const Home: FC<RouteComponentProps> = () => {
  const { allProduct } = useStaticQuery<Data>(graphql`
    {
      allProduct {
        nodes {
          id
          slug
          productName
          items {
            images {
              imageUrl
              imageText
            }
          }
        }
      }
    }
  `)

  return (
    <Layout>
      <SEO />
      <Grid my={4} gap={3} columns={[1, 2, 3, 4]}>
        <ProductList staticProducts={allProduct.nodes} dynamicProducts={[]} />
      </Grid>
    </Layout>
  )
}

export default Home
