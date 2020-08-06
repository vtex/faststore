/* eslint-disable no-shadow */
import { graphql, PageProps } from 'gatsby'
import React, { FC } from 'react'

import Layout from '../components/Layout'
import SearchTemplate from '../components/Search'
import SEO from '../components/SEO/siteMetadata'
import SearchProvider from '../providers/Search'
import { SearchPageQueryQuery } from './__generated__/SearchPageQuery.graphql'

export const query = graphql`
  query SearchPageQuery(
    $query: String
    $map: String
    $staticPath: Boolean = true
  ) {
    vtex {
      productSearch(query: $query, map: $map, from: 0, to: 9) {
        products @include(if: $staticPath) {
          ...ProductSummary_syncProduct
        }
        breadcrumb {
          href
          name
        }
        titleTag
      }
      facets(query: $query, map: $map) {
        brands {
          ...BrandSelector_brands
        }
        categoriesTrees {
          ...TreeSelector_tree
        }
      }
    }
  }
`

type Props = PageProps<
  SearchPageQueryQuery,
  {
    query: string
    map: string
    staticPath: boolean
  }
>

const PageTemplate: FC<Props> = ({ data, pageContext: { query, map } }) => (
  <Layout>
    <SEO title={data.vtex.productSearch!.titleTag!} />
    <SearchProvider initialOptions={{ query, map }} initialData={data}>
      <SearchTemplate search={data} />
    </SearchProvider>
  </Layout>
)

export default PageTemplate
