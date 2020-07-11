/** @jsx jsx */
/* eslint-disable react-hooks/rules-of-hooks */
import { api, Category, Product } from '@vtex/gatsby-source-vtex'
import { graphql } from 'gatsby'
import {
  Dispatch,
  FC,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react'
import useSWR from 'swr'
import { Button, Flex, Grid, Heading, jsx } from 'theme-ui'

import Container from '../components/Container'
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
