/** @jsx jsx */
import { RouteComponentProps } from '@reach/router'
import { graphql } from 'gatsby'
import { FC, useEffect, lazy } from 'react'
import { Grid, jsx } from 'theme-ui'

import Carousel from '../components/Carousel'
import Container from '../components/Container'
import Layout from '../components/Layout'
import { ProductSummary } from '../components/ProductSummary'
import SEO from '../components/SEO/siteMetadata'
import { SuspenseSSR } from '../components/SuspenseSSR'
import { SyncProductItem } from '../types/product'
import Fold from '../components/Home/Fold'
// const Fold = lazy(() => import('../components/Home/Fold'))

const itemsCarousel = [
  {
    src:
      'https://storecomponents.vtexassets.com/assets/faststore/images/banner___febafa22a7ffc9a7f2fd049f416e7c7b.webp?aspect=true&height=450',
    altText: 'Slide 2',
  },
  {
    src:
      'https://storecomponents.vtexassets.com/assets/faststore/images/banner-principal___79cc1c729926b4bd73092aa972d435c9.webp?aspect=true&height=450',
    altText: 'Slide 1',
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
          <Fold />
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
