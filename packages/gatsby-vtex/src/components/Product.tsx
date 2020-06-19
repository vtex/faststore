import React, { FC } from 'react'
import { Box, Button, Flex, Heading, Styled } from 'theme-ui'

import SEO from './Seo'

const Product: FC<{ data: any }> = ({ data }) => {
  const {
    product: { productName, items },
  } = data

  return (
    <>
      <SEO title={productName} />
      <Flex sx={{ flexWrap: 'wrap' }} mt={4}>
        <Box sx={{ maxWidth: '500px' }} mr={[0, 0, 4]} mb={[4, 0, 0]}>
          <Styled.img src={items[0].images[0].imageUrl} />
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

export default Product
