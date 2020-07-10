import { graphql } from 'gatsby'
import React, { FC } from 'react'

import Container from '../../components/Container'
import DynamicProduct from '../../components/DynamicProduct'
import Layout from '../../components/Layout'
import { StaticProduct } from '../../components/Shapes'

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
    <Container>
      <DynamicProduct staticProduct={data.product} />
    </Container>
  </Layout>
)

export default ProductPage
