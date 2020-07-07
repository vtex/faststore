import { RouteComponentProps } from '@reach/router'
import { graphql, useStaticQuery } from 'gatsby'
import React, { FC } from 'react'
import { Grid } from 'theme-ui'

import Carousel from '../components/Carousel'
import Container from '../components/Container'
import DynamicProductList from '../components/DynamicProductList'
import Layout from '../components/Layout'
import { AsyncProductsProvider } from '../components/providers/AsyncProducts'
import SEO from '../components/Seo'
import { SyncProductItem } from '../types/product'
import { ProductList } from '../components/ProductList'

interface Data {
  allProduct: {
    nodes: SyncProductItem[]
  }
}

const itemsCarousel = [
  {
    src: 'https://storecomponents.vtexassets.com/arquivos/banner-principal.png',
    altText: 'Slide 1',
  },
  {
    src: 'https://storecomponents.vtexassets.com/arquivos/banner.jpg',
    altText: 'Slide 2',
  },
]

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

  return (
    <Layout>
      <SEO />
      <Carousel items={itemsCarousel} />
      <Container>
        <Grid my={4} gap={3} columns={[1, 2, 3, 4]}>
          <DynamicProductList staticProducts={allProduct.nodes} />
        </Grid>
      </Container>
    </Layout>
  )
}

export default Home
