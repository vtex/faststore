/* eslint-disable no-shadow */
import { graphql, PageProps } from 'gatsby'
import React, { FC } from 'react'

import SearchTemplate from '../components/Search/index'
import Layout from '../components/Layout'
import SEO from '../components/SEO/siteMetadata'
import SearchFilterProvider from '../providers/SearchFilter'

export const query = graphql`
  query Search($query: String, $map: String) {
    vtex {
      productSearch(query: $query, map: $map, from: 0, to: 9) {
        products {
          productId
          productName
          description
          linkText
          items {
            itemId
            images {
              imageUrl
              imageText
            }
            sellers {
              sellerId
              # Uncomment the code below pre-render the commercial offer
              commertialOffer {
                AvailableQuantity
                Price
                ListPrice
              }
            }
          }
        }
        breadcrumb {
          href
          name
        }
        titleTag
      }
      facets(query: $query, map: $map) {
        brands {
          link
          name
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
  }
>

const PageTemplate: FC<Props> = ({
  data: { vtex },
  pageContext: { query, map },
}) => (
  <Layout>
    <SEO title={vtex.productSearch.titleTag} />
    <SearchFilterProvider initialOptions={{ query, map }}>
      <SearchTemplate search={vtex} />
    </SearchFilterProvider>
  </Layout>
)

export default PageTemplate
