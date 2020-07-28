import { graphql } from 'gatsby'
import React, { FC } from 'react'

import Container from '../../components/Container'
import Layout from '../../components/Layout'
import ProductDetails from '../../components/ProductDetails'
import { SyncProduct } from '../../types/product'

export const staticQuery = graphql`
  query GetProduct($slug: String) {
    vtex {
      product(slug: $slug) {
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
  }
`

interface Props {
  data: {
    vtex: {
      product: SyncProduct
    }
  }
}

const ProductPage: FC<Props> = (props) => {
  const {
    data: {
      vtex: { product },
    },
  } = props

  return (
    <Layout>
      <Container>
        <ProductDetails syncProduct={product} />
      </Container>
    </Layout>
  )
}

export default ProductPage
