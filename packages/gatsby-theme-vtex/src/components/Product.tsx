import React, { FC } from 'react'
import { Box, Button, Flex, Heading } from 'theme-ui'
import { Product } from '@vtex/gatsby-source-vtex'

import SEO from './Seo'
import ProductImage from './ProductImage'

interface Props {
  data: {
    product: Product
  }
}

const ProductTemplate: FC<Props> = ({ data }) => {
  const {
    product: { productName },
  } = data

  return (
    <>
      <SEO title={productName} />
      <Flex sx={{ flexWrap: 'wrap' }} mt={4}>
        <Box sx={{ maxWidth: '500px' }} mr={[0, 0, 4]} mb={[4, 0, 0]}>
          <ProductImage width={400} product={data.product} />
        </Box>
        <Flex sx={{ flexDirection: 'column' }}>
          <Heading variant="productTitle" as="h1">
            {productName}
          </Heading>
          <Button variant="productBuy">Add to Cart</Button>
        </Flex>
      </Flex>
    </>
  )
}

export default ProductTemplate
