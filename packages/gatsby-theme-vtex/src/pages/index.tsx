import { RouteComponentProps } from '@reach/router'
import { graphql, useStaticQuery } from 'gatsby'
import React, { FC } from 'react'
import { Grid } from 'theme-ui'

import Layout from '../components/Layout'
import { ProductList } from '../components/ProductList'
import SEO from '../components/Seo'

const Home: FC<RouteComponentProps> = () => {
  const { allProduct } = useStaticQuery(graphql`
    {
      allProduct {
        nodes {
          id
          productName
          slug
          items {
            images {
              imageUrl
            }
          }
        }
      }
    }
  `)

  return (
    <Layout>
      <SEO />
      <Grid mt={4} gap={3} columns={[2, null, 4]}>
        <ProductList data={allProduct.nodes} />
      </Grid>
    </Layout>
  )
}

export default Home
