import { graphql } from 'gatsby'
import React, { FC } from 'react'

import Layout from '../../components/Layout'
import ProductDetails from '../../components/ProductDetails'
import { SyncProduct } from '../../types/product'
import { AsyncProductsProvider } from '../../components/providers/AsyncProducts'

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

const ProductPage: FC<Props> = ({ data: { product } }) => {
  const filterOptions = {
    slug: product.linkText,
  }
  return (
    <Layout>
      <AsyncProductsProvider
        filterOptions={filterOptions}
        syncProducts={[product]}
      >
        <ProductDetails index={0} syncProduct={product} />
      </AsyncProductsProvider>
    </Layout>
  )
}

export default ProductPage
