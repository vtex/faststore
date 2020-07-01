import { Product as ProductType } from '@vtex/gatsby-source-vtex'
import { graphql } from 'gatsby'
import React, { FC } from 'react'

import Layout from '../../components/Layout'
import Product from '../../components/Product'

export const staticQuery = graphql`
  query($id: String!) {
    product(id: { eq: $id }) {
      productName
      items {
        images {
          imageUrl
          imageText
        }
        sellers {
          commertialOffer {
            AvailableQuantity
            Price
          }
        }
      }
    }
  }
`

interface Props {
  data: {
    product: ProductType
  }
}

const ProductPage: FC<Props> = (props) => (
  <Layout>
    <Product {...props} />
  </Layout>
)

export default ProductPage
