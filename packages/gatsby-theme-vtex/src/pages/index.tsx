/** @jsx jsx */
import { graphql, PageProps } from 'gatsby'
import { FC, useEffect } from 'react'
import { jsx } from '@vtex/store-ui'

import HomeBlocks from '../components/HomePage'
import Layout from '../components/Layout'
import SEO from '../components/SEO/siteMetadata'
import { HomePageQueryQuery } from '../__generated__/HomePageQuery.graphql'

type Props = PageProps<HomePageQueryQuery>

const Home: FC<Props> = ({ data }) => {
  useEffect(() => {
    ;(window as any).vtexrca('sendevent', 'homeView', {})
  }, [])

  return (
    <Layout>
      <SEO />
      <HomeBlocks data={data} />
    </Layout>
  )
}

export const query = graphql`
  query HomePageQuery {
    vtex {
      productSearch(
        from: 0
        to: 9
        orderBy: "OrderByScoreDESC"
        selectedFacets: [{ key: "c", value: "apparel---accessories" }]
        hideUnavailableItems: true
      ) {
        products {
          ...ProductSummary_syncProduct
        }
      }
    }
  }
`

export default Home
