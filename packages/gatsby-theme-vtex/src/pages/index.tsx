import { RouteComponentProps } from '@reach/router'
import { graphql, useStaticQuery } from 'gatsby'
import React, { FC } from 'react'
import { Grid } from 'theme-ui'

import Carousel from '../components/Carousel'
import Container from '../components/Container'
import DynamicProductList from '../components/DynamicProductList'
import Layout from '../components/Layout'
import SEO from '../components/Seo'
import { StaticProduct } from '../components/Shapes'

interface Data {
  allProduct: {
    nodes: StaticProduct[]
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
