/** @jsx jsx */
import { RouteComponentProps } from '@reach/router'
import { graphql } from 'gatsby'
import { FC, lazy, useEffect } from 'react'
import { jsx } from 'theme-ui'

import Carousel from '../components/Carousel'
import Container from '../components/Container'
import RichTextRow from '../components/Home/RichTextRow'
import Layout from '../components/Layout'
import SEO from '../components/SEO/siteMetadata'
import Shelf from '../components/Shelf'
import SuspenseDelay from '../components/SuspenseDelay'
import { SyncProductItem } from '../types/product'

const Fold = lazy(() => import('../components/Home/Fold'))

const itemsCarousel = [
  {
    src:
      'https://storecomponents.vtexassets.com/assets/faststore/images/banner___febafa22a7ffc9a7f2fd049f416e7c7b.webp?aspect=true&height=450',
    altText: 'Slide 2',
  },
  {
    src:
      'https://storecomponents.vtexassets.com/assets/vtex.file-manager-graphql/images/main___59700c0e5c56dcd769179d434f514892.webp?aspect=true&height=450',
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
      <RichTextRow />
      <Container>
        <Shelf syncProducts={syncProducts} />
      </Container>
      <SuspenseDelay fallback={null}>
        <Fold />
      </SuspenseDelay>
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
              ListPrice
            }
          }
        }
      }
    }
  }
`

export default Home
