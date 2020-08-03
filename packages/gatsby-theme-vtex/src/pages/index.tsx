/** @jsx jsx */
import { graphql, PageProps } from 'gatsby'
import { FC, useEffect, lazy } from 'react'
import { jsx } from 'theme-ui'

import Carousel from '../components/Carousel'
import Container from '../components/Container'
import Layout from '../components/Layout'
import SEO from '../components/SEO/siteMetadata'
import Shelf from '../components/Shelf'
import SuspenseDelay from '../components/SuspenseDelay'

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

type Props = PageProps<{
  vtex: any
}>

const Home: FC<Props> = ({ data }) => {
  const syncProducts = data.vtex.productSearch.products

  useEffect(() => {
    ;(window as any).vtexrca('sendevent', 'homeView', {})
  }, [])

  return (
    <Layout>
      <SEO />
      <Carousel items={itemsCarousel} />
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
  query HomePageQuery {
    vtex {
      productSearch(from: 0, to: 10) {
        products {
          productId
          productName
          linkText
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
  }
`

export default Home
