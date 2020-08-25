/** @jsx jsx */
import { graphql, PageProps } from 'gatsby'
import { FC, useEffect, lazy } from 'react'
import { jsx } from '@vtex/store-ui'

import Carousel from '../components/Carousel'
import Container from '../components/Container'
import Layout from '../components/Layout'
import SEO from '../components/SEO/siteMetadata'
import Shelf from '../components/Shelf'
import SuspenseDelay from '../components/SuspenseDelay'
import { HomePageQueryQuery } from '../__generated__/HomePageQuery.graphql'

const Fold = lazy(() => import('../components/Home/Fold'))

const itemsCarousel = [
  {
    src:
      'https://storecomponents.vtexassets.com/assets/faststore/images/banner___febafa22a7ffc9a7f2fd049f416e7c7b.webp?aspect=true&height=450',
    altText: 'Slide 2',
    width: 940,
    height: 450,
  },
  {
    src:
      'https://storecomponents.vtexassets.com/assets/vtex.file-manager-graphql/images/main___59700c0e5c56dcd769179d434f514892.webp?aspect=true&height=450',
    altText: 'Slide 1',
    width: 940,
    height: 450,
  },
]

type Props = PageProps<HomePageQueryQuery>

const Home: FC<Props> = ({ data }) => {
  useEffect(() => {
    ;(window as any).vtexrca('sendevent', 'homeView', {})
  }, [])

  return (
    <Layout>
      <SEO />
      <Carousel items={itemsCarousel} />
      <Container>
        <Shelf products={data.vtex.productSearch!.products!} />
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
          ...ProductSummary_syncProduct
        }
      }
    }
  }
`

export default Home
