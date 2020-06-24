import { RouteComponentProps } from '@reach/router'
import { graphql, useStaticQuery } from 'gatsby'
import React, { FC } from 'react'

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
      <ProductList data={allProduct.nodes} />
    </Layout>
  )
}

export default Home
