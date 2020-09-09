/** @jsx jsx */
import { graphql, PageProps } from 'gatsby'
import { FC, useEffect, lazy } from 'react'
import { jsx } from '@vtex/store-ui'

import HomeBlocks from '../components/HomePage'
import Layout from '../components/Layout'
import SEO from '../components/SEO/siteMetadata'
import SuspenseViewport from '../components/Suspense/Viewport'
import { HomePageQueryQuery } from '../__generated__/HomePageQuery.graphql'

const loader = () => import('../components/HomePage/Fold')

const Fold = lazy(loader)

type Props = PageProps<HomePageQueryQuery>

const Home: FC<Props> = ({ data }) => {
  useEffect(() => {
    ;(window as any).vtexrca('sendevent', 'homeView', {})
  }, [])

  return (
    <Layout>
      <SEO />
      <HomeBlocks data={data} />
      <SuspenseViewport fallback={null} preloader={loader}>
        <Fold />
      </SuspenseViewport>
    </Layout>
  )
}

export const query = graphql`
  query HomePageQuery {
    vtex {
      productSearch(from: 0, to: 9) {
        products {
          ...ProductSummary_syncProduct
        }
      }
    }
  }
`

export default Home
