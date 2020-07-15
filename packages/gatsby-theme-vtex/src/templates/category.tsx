import { Category } from '@vtex/gatsby-source-vtex'
import { graphql } from 'gatsby'
import React, { FC } from 'react'

import CategoryTemplate from '../components/Category'
import Layout from '../components/Layout'
import SEO from '../components/SEO/siteMetadata'

export const staticQuery = graphql`
  query($id: String!) {
    category(id: { eq: $id }) {
      name
      slug
      categoryId
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
            commertialOffer {
              AvailableQuantity
              Price
            }
          }
        }
      }
      facets {
        Brands {
          Name
          Link
        }
        CategoriesTrees {
          Link
          Name
          Children {
            Link
            Name
          }
        }
      }
    }
  }
`

interface Props {
  data: {
    category: Category
  }
}

const PageTemplate: FC<Props> = ({ data: { category } }) => (
  <Layout>
    <SEO title={category.name} />
    <CategoryTemplate category={category} />
  </Layout>
)

export default PageTemplate
