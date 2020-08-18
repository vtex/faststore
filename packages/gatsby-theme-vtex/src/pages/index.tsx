/** @jsx jsx */
import { graphql, PageProps } from 'gatsby'
import { FC, useEffect, lazy } from 'react'
import { jsx } from '@vtex/store-ui'

import HomeBlocks from '../components/Home'
import Container from '../components/Container'
import Layout from '../components/Layout'
import SEO from '../components/SEO/siteMetadata'
import Shelf from '../components/Shelf'
import SuspenseViewport from '../components/Suspense/Viewport'
import { HomePageQueryQuery } from '../__generated__/HomePageQuery.graphql'

const loader = () => import('../components/Home/Fold')

const Fold = lazy(loader)

type Props = PageProps<HomePageQueryQuery>

const Home: FC<Props> = ({ data }) => {
  useEffect(() => {
    ;(window as any).vtexrca('sendevent', 'homeView', {})
  }, [])

  return (
    <Layout>
      <SEO />
      <Container>
        <HomeBlocks pageData={data} />
        <Shelf products={data.vtex.productSearch!.products!} />
      </Container>
      <SuspenseViewport fallback={null} preloader={loader}>
        <Fold />
      </SuspenseViewport>
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
