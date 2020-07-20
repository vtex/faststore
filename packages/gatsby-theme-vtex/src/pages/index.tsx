import { RouteComponentProps } from '@reach/router'
import { graphql } from 'gatsby'
import React, { FC, useEffect, lazy } from 'react'
import { Grid } from 'theme-ui'

import Carousel from '../components/Carousel'
import Container from '../components/Container'
import Layout from '../components/Layout'
import { ProductSummary } from '../components/ProductSummary'
import SEO from '../components/SEO/siteMetadata'
import { SuspenseSSR } from '../components/SuspenseSSR'
import { SyncProductItem } from '../types/product'

const RichText = lazy(() => import('../components/RichText'))

const itemsCarousel = [
  {
    src: 'https://storecomponents.vtexassets.com/arquivos/ids/155434-360-450',
    altText: 'Slide 1',
  },
  {
    src: 'https://storecomponents.vtexassets.com/arquivos/banner.jpg',
    altText: 'Slide 2',
  },
]

interface Props extends RouteComponentProps {
  data: {
    allProduct: {
      nodes: SyncProductItem[]
    }
  }
}

const Home: FC<Props> = ({ data: { allProduct } }) => {
  const syncProducts = allProduct.nodes

  useEffect(() => {
    ;(window as any).vtexrca('sendevent', 'homeView', {})
  }, [])

  return (
    <Layout>
      <SEO />
      <Carousel items={itemsCarousel} />
      <Container>
        <Grid my={4} gap={3} columns={[1, 2, 3, 4]}>
          {syncProducts.map((syncProduct) => (
            <ProductSummary key={syncProduct.id} syncProduct={syncProduct} />
          ))}
        </Grid>
        <SuspenseSSR fallback={null}>
          <RichText
            text={`**This is an example store built using the VTEX platform.\nWant to know more?**`}
            variant="question"
          />
          <RichText
            text={`\n**Reach us at**\nwww.vtex.com.br`}
            variant="link"
          />
        </SuspenseSSR>
      </Container>
    </Layout>
  )
}

export const query = graphql`
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
`

export default Home
