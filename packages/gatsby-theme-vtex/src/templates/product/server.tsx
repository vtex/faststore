import { graphql } from 'gatsby'
import React, { FC } from 'react'

import DynamicProduct from '../../components/DynamicProduct'
import Layout from '../../components/Layout'
import { StaticProduct } from '../../components/Shapes'

export const staticQuery = graphql`
  query($id: String!) {
    product(id: { eq: $id }) {
      id
      slug
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
`

interface Props {
  data: {
    product: StaticProduct
  }
}

const ProductPage: FC<Props> = ({ data }) => (
  <Layout>
    <DynamicProduct staticProduct={data.product} />
  </Layout>
)

export default ProductPage
