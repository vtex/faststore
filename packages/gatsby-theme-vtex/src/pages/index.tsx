/** @jsx jsx */
import { graphql, PageProps } from 'gatsby'
import { FC, useEffect, lazy } from 'react'
import { jsx } from '@vtex/store-ui'

import HomeBlocks from '../components/Home'
import Layout from '../components/Layout'
import SEO from '../components/SEO/siteMetadata'
import SuspenseDelay from '../components/SuspenseDelay'
import { HomePageQueryQuery } from '../__generated__/HomePageQuery.graphql'

const Fold = lazy(() => import('../components/Home/Fold'))

type Props = PageProps<HomePageQueryQuery>

const Home: FC<Props> = ({ data }) => {
  useEffect(() => {
    ;(window as any).vtexrca('sendevent', 'homeView', {})
  }, [])

  return (
    <Layout>
      <SEO />
      <HomeBlocks pageData={data} />
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
