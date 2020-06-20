import { Category } from '@vtex/gatsby-source-vtex'
import { graphql } from 'gatsby'
import React, { FC } from 'react'
import { Flex, Heading } from 'theme-ui'

import Layout from '../components/layout'
import SEO from '../components/seo'

export const staticQuery = graphql`
  query($id: String!) {
    category(id: { eq: $id }) {
      name
    }
  }
`

interface Props {
  data: {
    category: Category
  }
}

const CategoryTemplate: FC<Props> = ({ data }) => {
  return (
    <Layout>
      <SEO title={data.category.name} />
      <Flex sx={{ flexDirection: 'column' }} my={4}>
        <Heading as="h1">{data.category.name}</Heading>
        <Flex sx={{ flexWrap: 'wrap' }} mt={4}>
          products
        </Flex>
      </Flex>
    </Layout>
  )
}

export default CategoryTemplate
