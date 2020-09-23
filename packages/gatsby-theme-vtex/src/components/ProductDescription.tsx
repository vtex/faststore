/** @jsx jsx */
import { graphql } from 'gatsby'
import { FC } from 'react'

import { Container, Heading, jsx } from '@vtex/store-ui'

interface Props {
  description: any
}

const ProductDescription: FC<Props> = ({ description }) => {
  const productDescription = { __html: description }

  return (
    <Container>
      <Heading variant="product.description" as="h3">
        Product Description
      </Heading>
      <div dangerouslySetInnerHTML={productDescription} />
    </Container>
  )
}

export const query = graphql`
  fragment ProductDetailsTemplate_product on VTEX_Product {
    productName
    description
    linkText
    items {
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
`

export default ProductDescription
