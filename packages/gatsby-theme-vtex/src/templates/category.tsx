import { Category, Product } from '@vtex/gatsby-source-vtex'
import { graphql } from 'gatsby'
import React, { FC } from 'react'

import CategoryTemplate from '../components/Category'
import Layout from '../components/Layout'
import SEO from '../components/SEO/siteMetadata'

export const staticQuery = graphql`
  query($id: String!, $categoryId: Int!) {
    category(id: { eq: $id }) {
      name
      slug
      categoryId
    }
    categorySearchResult(categoryId: { eq: $categoryId }) {
      products {
        id
        slug
        productId
        productName
        description
        linkText
        items {
          images {
            imageUrl
            imageText
          }
        }
      }
    }
  }
`

interface Props {
  data: {
    category: Category
    categorySearchResult: {
      products: Product[]
    }
  }
}

// TODO - prefetch next pages when button is seen

const PageTemplate: FC<Props> = ({ data }) => {
  return (
    <Layout>
      <SEO title={data.category.name} />
      <CategoryTemplate
        categorySearchResult={data.categorySearchResult}
        category={data.category}
      />
    </Layout>
  )
}

export default PageTemplate
