import { Category, Product } from '@vtex/gatsby-source-vtex'
import { graphql } from 'gatsby'
import React, { FC } from 'react'
import { Flex, Heading } from 'theme-ui'

import Layout from '../components/Layout'
import SEO from '../components/Seo'
import { ProductList } from '../components/ProductList'

export const staticQuery = graphql`
  query($id: String!, $categoryId: String!) {
    category(id: { eq: $id }) {
      name
    }
    allProduct(filter: { categoryId: { eq: $categoryId } }) {
      nodes {
        id
        productName
        slug
        productName
        items {
          images {
            imageUrl
          }
        }
      }
    }
  }
`

interface Props {
  data: {
    allProduct: {
      nodes: Product[]
    }
    category: Category
  }
}

const CategoryTemplate: FC<Props> = ({ data }) => {
  return (
    <Layout>
      <SEO title={data.category.name} />
      <Flex sx={{ flexDirection: 'column' }} my={4}>
        <Heading as="h1">{data.category.name}</Heading>
        <ProductList data={data.allProduct.nodes} />
      </Flex>
    </Layout>
  )
}

export default CategoryTemplate
