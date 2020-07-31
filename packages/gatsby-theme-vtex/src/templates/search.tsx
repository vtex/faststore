/* eslint-disable no-shadow */
import { graphql, PageProps } from 'gatsby'
import React, { FC } from 'react'

import SearchTemplate from '../components/Search/index'
import Layout from '../components/Layout'
import SEO from '../components/SEO/siteMetadata'
import SearchProvider from '../providers/Search'

export const query = graphql`
  query Search($query: String, $map: String, $staticPath: Boolean = true) {
    vtex {
      productSearch(query: $query, map: $map, from: 0, to: 9) {
        products @include(if: $staticPath) {
          ...PageList_product
        }
        breadcrumb {
          href
          name
        }
        titleTag
      }
      facets(query: $query, map: $map) {
        brands {
          name
          value
          quantity
        }
        categoriesTrees {
          link
          name
          quantity
          children {
            link
            name
            quantity
          }
        }
      }
    }
  }
`

type Props = PageProps<
  {
    vtex: any
  },
  {
    query: string
    map: string
    staticPath: boolean
  }
>

const PageTemplate: FC<Props> = ({
  data: { vtex },
  pageContext: { query, map },
}) => (
  <Layout>
    <SEO title={vtex.productSearch.titleTag} />
    <SearchProvider
      initialOptions={{ query, map }}
      initialData={vtex.productSearch.products}
    >
      <SearchTemplate search={vtex} />
    </SearchProvider>
  </Layout>
)

export default PageTemplate
