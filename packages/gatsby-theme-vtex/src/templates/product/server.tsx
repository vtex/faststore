import { graphql } from 'gatsby'
import React, { FC } from 'react'

import Layout from '../../components/Layout'
import ProductDetails from '../../components/ProductDetails'
import { SyncProduct } from '../../types/product'

export const staticQuery = graphql`
  query($id: String!) {
    product(id: { eq: $id }) {
      id
      slug
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
      }
    }
  }
`

interface Props {
  data: {
    product: SyncProduct
  }
}

const ProductPage: FC<Props> = ({ data: { product } }) => (
  <Layout>
    <ProductDetails syncProduct={product} />
  </Layout>
)

export default ProductPage
