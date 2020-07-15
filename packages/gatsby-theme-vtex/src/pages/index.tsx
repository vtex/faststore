import { RouteComponentProps } from '@reach/router'
import { graphql, useStaticQuery } from 'gatsby'
import React, { FC } from 'react'
import { Grid } from 'theme-ui'

import Carousel from '../components/Carousel'
import Container from '../components/Container'
import Layout from '../components/Layout'
import { ProductSummary } from '../components/ProductSummary'
import SEO from '../components/SEO/siteMetadata'
import { SyncProductItem } from '../types/product'

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
      {/* <Carousel items={itemsCarousel} /> */}
      <Container>
        <Grid my={4} gap={3} columns={[1, 2, 3, 4]}>
          {syncProducts.map((syncProduct, index) => (
            <ProductSummary
              key={syncProduct.id}
              syncProduct={syncProduct}
              lazyLoad={index > 3}
            />
          ))}
        </Grid>
      </Container>
    </Layout>
  )
}

export default Home
